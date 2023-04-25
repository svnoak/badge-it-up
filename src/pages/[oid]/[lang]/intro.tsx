import Head from 'next/head';
import { OrganisationExists } from '@/pages/api/OrganisationExists';
import { Button, ButtonProps, Card, CardContent, Checkbox, Container, Divider, FormControlLabel, FormGroup, Stack, Typography, styled } from '@mui/material';
import { useRouter } from 'next/router';
import logUserAction from '@/lib/logUserAction';
import logUserRequests from '@/lib/server/logUserRequests';
import cookie from 'js-cookie';
import serverCookie from 'cookie';
import { useState } from 'react';
import { purple } from '@mui/material/colors';
import userExists from '@/lib/server/userExists';
import { v4 as uuidv4 } from 'uuid';
import Link from 'next/link';

export async function getServerSideProps(context: any){
  const prod = process.env.PROD == "true";
  const {oid, lang} = context.query;
  if( !context.req.headers.cookie ){
    logUserRequests(`failed request: /${oid}/${lang}/intro - no cookie`, {oid, lang});
    return { redirect: {permanent: false, destination: `/${oid}/`} }
  }

  let uuid = serverCookie.parse(context.req.headers.cookie)[oid];

  if( !uuid ) uuid = uuidv4();

  const respondentExists: boolean = await userExists(uuid);

  if( respondentExists && prod ){
    logUserRequests(`respondent already exists, redirect to form`, {oid, uuid});
    return { redirect: {permanent: false, destination: `/${oid}/${lang}/form/1`} }
  }

  const organisation = await OrganisationExists(oid);
  if( !organisation ) {
    logUserRequests(`failed request: no organisation ${oid}`, {oid, uuid} );
    return { notFound: true }
  }

  logUserRequests(`successfull request /${oid}/${lang}/intro`, {oid, uuid, lang})
  return {
    props: {
      oid,
      lang,
      uuid,
      prod,
      organisation
    }
  }
}

export default function Intro({oid, lang, uuid, prod, organisation}: any) {

  const [checked, setChecked] = useState<boolean>(false);

  const formtexts: any = {
    en: {
      title: "Volunteer survey",
      paragraphs: [
        {text: `Here you write the consenttext before respondents start filling out the survey.`}, 
        {text: `Each object is a paragraph and you can show the organisations name by writing ${organisation}`},
    ],
    outText: "You can opt out from the study at any time on",
    linkText: "our opt-out page",
    acceptText: "I confirm, that I am over 18 years old (or have approval of guardian) and have read the above text and that I accept the terms above to fill in the survey.",
    button: "Next",
    },
    sv: {
      title: "Volontärenkät",
      paragraphs: [
        {text: `This is the swedish part for the consent text, but it can be disregarded if you only do it in one language`},
      ],
      outText: "Vill du dra tillbaka ditt deltagande kan du göra det på",
      linkText: "vår opt-out sida",
      acceptText: "Jag bekräftar att jag är över 18 år (eller har godkännande av vårdnadshavare) och läst ovanstående text och godkänner villkoren för att fylla i enkäten.",
      button: "Nästa",
    }
  }

  const router = useRouter();

  async function handleConfirmation(devMode: boolean, gamified?: boolean){

    const localStorageExists: boolean = !!localStorage.getItem(oid);

    const bodyObj = {
      oid,
      lang,
      uuid,
      localStorageExists,
      devMode: gamified,
      userAgent: navigator.userAgent,
    }

    const request = await fetch("/api/initial", {
      method: "POST",
      body: JSON.stringify(bodyObj),
    })

    if( !request.ok ) {
      alert("Något gick fel, försök igen.");
      return;
    }

    const requestString = await request.json();

    if( requestString ) {
      cookie.set(oid, uuid, {domain: process.env.DOMAIN, expires: 90, sameSite: 'Lax', secure: true});
      cookie.set("passphrase", JSON.parse(requestString).passphrase);
      localStorage.setItem(oid, requestString);
      logUserAction(`accepting terms`, {oid, uuid, lang})
    }

    if ( devMode ){
      await fetch( "/api/setGamified", {
        method: "POST",
        body: JSON.stringify(bodyObj),
      })
    }

    router.push(`/${oid}/${lang}/form/1`);
    //router.reload();
  }

  function devMode(gamified: boolean) {
    handleConfirmation(true, gamified);
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
      <main>
        <Container maxWidth={"sm"} sx={{marginTop: "10px"}}>
        <Stack spacing={1.5}>
        <Card variant="outlined" sx={{ borderRadius: 2, borderTop: 10, borderTopColor: "rgb(103, 58, 183)" }}>
          <CardContent>
          <Typography variant='h4' sx={{textTransform: "uppercase"}}>{formtexts[lang].title}</Typography>
          </CardContent>
          <Divider />
          <CardContent>
            {formtexts[lang].paragraphs.map( (line: any, index: number) => <Typography gutterBottom key={index}>{line.text}</Typography> )}
            <Typography>{formtexts[lang].outText} <Link href={`/${oid}/opt-out`}>{formtexts[lang].linkText}</Link></Typography>
          </CardContent>
        </Card>
        {
          !prod ? (
            <Card variant='outlined' sx={{backgroundColor: "beige"}}>
              <CardContent>
                <Stack spacing={2}>
                <Typography fontWeight={"bold"}>TESTMODE IS ACTIVATED! CHOOSE SURVEYTYPE</Typography>
                <Divider />
                <Button variant="contained" onClick={() => devMode(true)}>Gamified</Button>
                <Button variant="contained" onClick={() => devMode(false)}>Traditionall</Button>
                </Stack>
              </CardContent>
            </Card>
          ) : (
        <Card variant='outlined'>
          <CardContent>
            <Stack spacing={3}>
            <FormGroup>
              <FormControlLabel control={<Checkbox checked={checked} onChange={() => setChecked(!checked)}/>} label={<Typography variant="caption">{formtexts[lang].acceptText}</Typography>} />
            </FormGroup>
            <ColorButton variant={"contained"} disabled={!checked} onClick={() => handleConfirmation(false)}>{formtexts[lang].button}</ColorButton>
            </Stack>
          </CardContent>
        </Card>
        )
        }
        </Stack>
        </Container>
      </main>
    </>
  )
}
