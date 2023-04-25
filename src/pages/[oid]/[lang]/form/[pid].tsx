import Head from 'next/head';
import Formelement from '@/components/Formview/Formelement';
import { Alert, Button, ButtonProps, Card, CardContent, Container, Divider, Stack, styled, Typography } from '@mui/material';
import { purple } from '@mui/material/colors';
import { OrganisationExists } from '@/pages/api/OrganisationExists';
import { loadFormQuestions } from '@/pages/api/form/loadSection';
import Parser from 'html-react-parser';
import { useEffect, useState } from 'react';
import getLatestCompletedSection from '@/pages/api/getLatestCompletedSection';
import logUserAction from '@/lib/logUserAction';
import logUserRequests from '@/lib/server/logUserRequests';
import serverCookie from 'cookie';
import SidePanel from '@/components/sidePanel/SidePanel';
import { loadBadges } from '@/pages/api/form/loadBadges';
import BadgeModal from '@/components/Formview/BadgeModal';
import badgeHandler from '@/lib/badgeHandler';
import styles from '@/styles/Main.module.css';
import { loadRespondentObject } from '@/pages/api/form/loadRespondentObject';
import saveAnswerInLocalStorage from '@/lib/saveAnswerInCookie';
import updateFirestore from '@/lib/updateFirestore';

export async function getServerSideProps(context: any){
  let {oid, lang, pid} = context.query;
  const cookies = context.req.headers.cookie;
  if( !cookies ){
    logUserRequests(`failed request: /${oid}/${lang}/form/${pid} - no cookie`, {oid, lang, pid});
    return { redirect: {permanent: false, destination: `/${oid}/`} }
  }

  const uuid =  serverCookie.parse(cookies)[oid];
  const passphrase = serverCookie.parse(cookies).passphrase;

  let respondentObject: any;
  if( uuid ) {
    respondentObject = await loadRespondentObject(uuid, passphrase);
  } else {
    logUserRequests(`failed request: /${oid}/${lang}/form/${pid} - no cookie`, {oid, lang, pid});
    return { redirect: {permanent: false, destination: `/${oid}/`} }
  }

  if( respondentObject == null ){
    logUserRequests(`failed request: /${oid}/${lang}/form/${pid} - wrong passphrase`, {oid, lang, pid});
    return { redirect: {permanent: false, destination: `/${oid}/`} }
  }

  if( respondentObject.sections.every( (section: boolean) => section ) ){
    logUserRequests(`failed request: /${oid}/${lang}/form/${pid} - already submitted`, {oid, lang, pid});
    return { redirect: {permanent: false, destination: `/${oid}/${lang}/form/submit`} }
  }

  let answers = [[], [], []];

  if( respondentObject.answers ){
    answers = JSON.parse(respondentObject.answers);
  }
  
  let gamified = respondentObject.gamified;

  const organisation = await OrganisationExists(oid);
  if( !organisation ) {
    logUserRequests(`failed request: /${oid}/${lang}/form/${pid} - organisation does not exist`, {oid, uuid, gamified} );
    return { notFound: true }
  }
  pid = parseInt(pid);

  // Check if previous section has been completed and if not, redirect back.
  if( pid > 1 ){
    const latestCompletedSection = await getLatestCompletedSection(uuid);
    if( latestCompletedSection === null ) return { redirect: {permanent: false, destination: `/${oid}/`} }
    if( latestCompletedSection + 1 < pid - 1 ){
      logUserRequests(`failed request: section before not completed ${pid}`,{oid, uuid, lang, gamified})
      return { redirect: {permanent: false, destination: `/${oid}/${lang}/form/${latestCompletedSection+2}`} }
    }
  }
  
  if( pid < 1 || pid > 3 ) {
    logUserRequests(`failed request: form/${pid}`, {oid, uuid, lang});
    return { notFound: true };
  }

  logUserRequests(`successfull request: /${oid}/${lang}/form/${pid}`, {oid, uuid, lang, gamified} );
  let questions = await loadFormQuestions(pid);
  questions = questions.map( (question: any) => {
    const word = lang == "sv" ? "organisationen" : "the organisation";
    const questionTitle: string =  question.question[lang].title;

    question.question[lang].title = questionTitle.replaceAll(word, organisation);

    return question;
  })


  let badges = null;
  if( gamified ){
    const respondentBadges = respondentObject.badges;
    badges = (await loadBadges()).map( (badge: any, index: number) => {
      return {...badge, active: respondentBadges[index] ?? false}
    })
  }

  return {
    props: {
      oid,
      lang,
      pid,
      questions,
      gamified,
      answers,
      badges,
      organisation
    }
  }
}

export default function Form({pid, lang, oid, questions, gamified, answers, badges, organisation}: any) {

  const formData: any[]= [];

  questions.forEach( (question: any) => {
    const answer = answers[pid-1].find( (answer: { questionId: string; }) => {
      return answer.questionId === question.id;
    })?.answer ?? "";
    const answerObject = {
      ...question,
      answer,
      errorState: false
    }
    formData.push(answerObject);
  })


  const [formState, setFormState] = useState<any>(formData);
  const [rerender, setRerender] = useState<boolean>(false);
  const [showBadge, setShowBadge] = useState({show: false, index: -1});
  const [badgeArray, setBadgeArray] = useState(badges);

  useEffect(() => {
    if( showBadge.show ) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [formState, rerender, showBadge, badgeArray])

  function scrollToFirstError(): void {
    const errorElements = document.querySelectorAll('.formCardError');
    if (errorElements.length) {
      const firstErrorElement = errorElements[0] as HTMLElement;
      const scrollPosition = firstErrorElement.offsetTop - (window.innerHeight / 2 - firstErrorElement.offsetHeight / 2);
      window.scrollTo({ top: scrollPosition });
    }
  }
  
  const formtexts: any = {
    "sv": {
      title: "Volontärenkät",
      required: "Obligatorisk",
      alert1: `Enkätsvar i denna delen <strong>kommer att</strong> delas med ${organisation}`,
      alert2: `Enkätsvar i denna delen kommer <strong>inte</strong> att delas med ${organisation}`,
      dropdown: "Välj",
      textfield: "Ditt svar",
      next: "Nästa",
      prev: "Tillbaka",
      submit: "Skicka",
      error: "Detta är en obligatorisk fråga",
      birthdate: "Skriv ditt födelseår med alla 4 siffror",
      multifield: "Du måste fylla i minst ett av fälten"
    },
    "en": {
      title: "Volunteer survey",
      required: "Required",
      alert1: `Survey answers in this part <strong>will</strong> be shared with ${organisation}`,
      alert2: `Survey answers in this part will <strong>not</strong> be shared with ${organisation}`,
      dropdown: "Choose",
      textfield: "Your answer",
      next: "Next",
      prev: "Back",
      submit: "Submit",
      error: "This is a required question",
      birthdate: "Write your birthyear with all 4 numbers",
      multifield: "You need to fill in at least one field"
    }
  }

  /**
   * 
   * @param questionId 
   * @param answer 
   * @param errorState 
   */
  function _updateState(questionId: string, answer: string, errorState: boolean, logAnswer:boolean = true){
    const newStateArray = formState.map( (state: any) => {
        if( questionId === state.id ){
          if( state.answer == answer || state.answer && logAnswer) logUserAction(`revisted question`, {oid, lang, questionId}, localStorage.getItem(oid) as string);
            state.answer = answer;
            state.errorState = errorState;
            saveAnswerInLocalStorage(pid, questionId, answer, oid);
            logUserAction(`logging answer ${questionId}`, {questionId, answer}, localStorage.getItem(oid) as string);
            badgeHandler(oid, setShowBadge, badgeArray, setBadgeArray, gamified);
            updateFirestore(oid);
        }
        return state;
    })
    setFormState(newStateArray);
  }

  async function nextPageHandler(){
    const newState = formState;
    const unanswered = newState.filter( (state:any) => {
      if( state.id === "zjv4xxO8TUptjFvDQdRD" && state.answer.length !== 4) return true;
      if( state.required && (state.answer === "" || state.answer == "-1" ) ) return true;
      return false;
    });

    if( !!unanswered.length ) {
      logUserAction(`next page request with ${unanswered.length} unanswered questions`, {oid, lang}, localStorage.getItem(oid) as string)
      let newState = formState.reduce((acc: any[], state: { id: any; }) => {
        const hasUnanswered = unanswered.some((question: any) => question.id === state.id);
      
        // if the current state has an unanswered question, set errorState to true
        if (hasUnanswered) {
          acc.push({ ...state, errorState: true });
        } else {
          acc.push(state);
        }
      
        return acc;
      }, []);

      setFormState(newState);
      setRerender(!rerender);
      scrollToFirstError();
      return;
    }
    
    const completed =  await fetch( `/api/form/requiredAnswered?pid=${pid}&oid=${oid}`, {
      credentials: "include",
      method: "POST",
      body: localStorage.getItem(oid),
    });
    if( completed.ok ) {

      logUserAction(`section completed: ${pid}`, {oid, lang}, localStorage.getItem(oid) as string);
      window.location.href = `/${oid}/${lang}/form/${pid + 1}`;
      return;
    } else {
      logUserAction(`next page request failed: unanswered questions`, {oid, lang}, localStorage.getItem(oid) as string);
      const unansweredArray = await completed.json();
      let newState;
      unansweredArray.forEach( (questionId: string) => {
        newState = formState.map( (state: any) => {
          if( state.id === questionId ) {
            return {...state, errorState: true}
          } else {
            return state;
          }
        })
      })
      setFormState(newState);
      setRerender(!rerender);
      return;
    }
  }

  function prevPageHandler(){
    if( pid === 1 ) return;
    logUserAction(`going to previous page: ${pid-1}`, {oid, lang}, localStorage.getItem(oid) as string);
    window.location.href = `/${oid}/${lang}/form/${pid-1}`;
  }

  async function submitHandler(){
      logUserAction(`submitting form`, {oid, lang}, localStorage.getItem(oid) as string);
      const completed =  await fetch( `/api/form/requiredAnswered?pid=${pid}&oid=${oid}`, {
        credentials: "include",
        method: "POST",
        body: localStorage.getItem(oid),
      });
      if( completed.ok ) {
        window.location.href = `/${oid}/${lang}/form/submit`;
      }
    }

  const ColorButton = styled(Button)<ButtonProps>(({ theme }) => ({
      color: theme.palette.getContrastText(purple[500]),
      backgroundColor: purple[500],
      '&:hover': {
        backgroundColor: purple[700],
      },
    }));

  return (
    <>
      <main className={styles.main}>
        {
          showBadge.show && <BadgeModal badges={badges} lang={lang} index={showBadge.index} setShowBadge={setShowBadge} key={Date.now()}/>
        }
        <Container maxWidth={"sm"} id={styles.sideContainer}>
          <SidePanel gamified={gamified} lang={lang} badges={badgeArray} oid={oid} submitPage={false}/>
        </Container>
        
        <Container maxWidth={"sm"} className={styles.form}>
            <Stack spacing={1.5}>
                <Card variant="outlined" sx={{ borderRadius: 2, borderTop: 10, borderTopColor: "rgb(103, 58, 183)" }}>
                    <CardContent>
                    <Typography variant='h4' sx={{textTransform: "uppercase"}}>{formtexts[lang].title}</Typography>
                    </CardContent>
                    <Divider variant="fullWidth" sx={{width: "100%"}}/>
                    <CardContent>
                    <Typography variant='body2' sx={{color: "#d93025"}}>*{formtexts[lang].required}</Typography>
                    </CardContent>
                </Card>
                {pid == 2 ?
                    <Alert severity="warning">{Parser(formtexts[lang].alert1)}</Alert> :
                    <Alert severity="warning">{Parser(formtexts[lang].alert2)}</Alert>
                }
                {
                formState.map( (formObject: any, index: number) => {
                const question = formObject.question[lang];
                return(
                <Formelement 
                    data={formObject}
                    question={question}
                    key={index} 
                    rerender={rerender} 
                    _updateState={_updateState}
                    errorState={formObject.errorState}
                    formtexts={formtexts[lang]}
                  />
                  )             
                }
                )
                }
                <Stack direction="row" spacing={1.5}>
                    {pid > 1 &&  <ColorButton variant="contained" sx={{textTransform: "none"}} onMouseDown={prevPageHandler}>{formtexts[lang].prev}</ColorButton> }
                    { pid < 3 ? 
                    <ColorButton variant="contained" sx={{textTransform: "none"}} onMouseDown={nextPageHandler}>{formtexts[lang].next}</ColorButton> : 
                    <ColorButton variant="contained" sx={{textTransform: "none"}} onClick={submitHandler}>{formtexts[lang].submit}</ColorButton> }
                </Stack>
            </Stack>
        </Container>
      </main>
    </>
  )
}