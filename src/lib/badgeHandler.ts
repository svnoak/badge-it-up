import { useRouter } from 'next/router';
import logUserAction from './logUserAction';
import saveBadgeInLocalStorage from './saveBadgeInCookie';

export default function badgeHandler(oid: string, setShowBadge: Function, badgeArray: any, setBadgeArray: Function, gamified: boolean) {
    const localStorageObject = JSON.parse(localStorage.getItem(oid) as string);
    const { badges, answers } = localStorageObject;

    for (let i = 0; i < badges.length; i++) {
      let before = badges[i];
        if( i === 0 || i === 2 || i === 3 ){
          let section = 0;
          if( i === 0 ) section = 0;
          if( i === 2 ) section = 1;
          if( i === 3 ) section = 2;
          badges[i] = checkAnswersOfSection(section, answers);
        } else if( i === 1 ) {
          badges[i] = checkThreePartFeedback(answers);
        } else if( i === 4 ) {
          badges[i] = checkAllAnswers(answers);
        } else if( i === 5 ) {
          badges[i] = checkWordLength(answers, 20);
        } else if( i === 6 ){
          badges[i] = checkShakespear(badges, answers);
        } else if ( i === 7 ){
          badges[i] = checkSubmission()
        }

        if( badges[i] && before !== badges[i] ) {
          logUserAction(`badge received ${i}`, {oid}, localStorage.getItem(oid) as string);

          if( gamified ){
            setShowBadge({show: true, index: i});
          }

        } else if( !badges[i] && before !== badges[i] ){
          logUserAction(`badge lost ${i}`, {oid}, localStorage.getItem(oid) as string);
        }
    }

  if( gamified ){
    const newBadgeArray = badgeArray.map( (badge: any, index: number) => {
      return {...badge, active: badges[index]}
    })
    setBadgeArray(newBadgeArray);
  }

  saveBadgeInLocalStorage(badges, oid);
}
  
  function checkAnswersOfSection(section: number, answers: [[{questionId: string, answer: any}]]){
    let achieved = true;
    let amountAnswers;

    if( section === 1 ){
      amountAnswers = 16;
    } else {
      amountAnswers = 5;
    }
    if( answers[section].length >= amountAnswers ){

      for (let index = 0; index < answers[section].length; index++) {
        const answerObj = answers[section][index];
        if( answerObj.questionId === "Y2zFcxBK31RYUc3J6tVx" || answerObj.questionId === "QenrDtfEMOMH9wgMbEUe"){

          const dropdown = answers[section].find( answer => answer.questionId === "QenrDtfEMOMH9wgMbEUe" );
          const text = answers[section].find( answer => answer.questionId === "Y2zFcxBK31RYUc3J6tVx" );
          if( dropdown?.answer != "5" && (!text || text?.answer.length < 1)){
            achieved = false;
          }
        }
        // Utveckla: Y2zFcxBK31RYUc3J6tVx
        // Dropdown: QenrDtfEMOMH9wgMbEUe

        if( answerObj.questionId === "zjv4xxO8TUptjFvDQdRD" && answerObj.answer.length < 4 ){
          achieved = false;
          break;
        }
        if( answerObj.questionId === "CIQfZfjIB9so9zoTAEuJ" || answerObj.questionId === "vK442vMImlEPzkDbuLEK") {
          let ach = true;
          for(  let index = 0; index < answerObj.answer.length; index++ ) {
            let field = answerObj.answer[index];
            if( field === "" || field === undefined) {
              ach = false;
              break;
            }
          }
          achieved = ach;
          if ( achieved === false ) break;
        }
        if( answerObj.answer === undefined || answerObj.answer === "" || answerObj.answer == -1 ) {
          achieved = false;
          break;
        }

        if( answerObj.questionId === "uHiisDu0H6Zb3XTMn0dG" ) {
          const min = answerObj.answer.split(":")[0];
          const sec = answerObj.answer.split(":")[1];
          
          achieved = (min != "" && min != undefined) && (sec != "" && sec != undefined);
        }
      }
    } else {
      achieved = false;
    }
    return achieved;
  }
  
  function checkThreePartFeedback(answers: any){
    const good = answers[1].find( (answer: { questionId: any; }) => answer.questionId === "CIQfZfjIB9so9zoTAEuJ" );
    const bad = answers[1].find( (answer: { questionId: any; }) => answer.questionId === "vK442vMImlEPzkDbuLEK" );
    
    const achieved = [false,false,false,false,false,false];

    if( good && bad ){

      try{
        good.answer = JSON.parse(good.answer);
        bad.answer = JSON.parse(bad.answer);
      } catch{
        return false;
      }

      const allFields = good.answer.concat(bad.answer);

      allFields.forEach( (field: any, index: number) => {
        if( !(field === "" || field === undefined || !field)  ) achieved[index] = true; 
      })
  
      if( achieved.every( a => a === true ) ) return true;
    }

    return false;
  }
  
  function checkAllAnswers(answers: any){

    const required: any[] = [
      {id: "2h5HCXwjfIt5NsGZ6S97", answered: false},
      {id: "3w3691TBLY8zIjgukA1F", answered: false},
      {id: "6eHS5TaEKjkRlNFPlN6e", answered: false},
      {id: "CIQfZfjIB9so9zoTAEuJ", answered: false},
      {id: "Ce2M6SVesrUXcWCNUnmv", answered: false},
      {id: "NOGZ8BDmLV8XtX7aiy9C", answered: false},
      {id: "NnbreFWfo0424fkYU3C1", answered: false},
      {id: "QenrDtfEMOMH9wgMbEUe", answered: false},
      {id: "Ur8HDN7ZYYaSAt7xzNaI", answered: false},
      {id: "W09yL5ehfvBGdEihjKtT", answered: false},
      {id: "WBjQ0npwXyE7uYZZqZfH", answered: false},
      {id: "X1c2stEMB7UXGC78nDC9", answered: false},
      {id: "byhpuIEAD1zcT5uwusrx", answered: false},
      {id: "dIjZ47To3Q04oushbq52", answered: false},
      {id: "udcvzWa1O6dXTdyJSGlZ", answered: false},
      {id: "vK442vMImlEPzkDbuLEK", answered: false},
      {id: "zjv4xxO8TUptjFvDQdRD", answered: false},
    ]

    for( let index = 0; index < required.length; index++ ){
      const requiredObj = required[index];
      answers.forEach( (section: any[]) => {
        section.forEach( (answerObj: any) => {
          if( requiredObj.id === answerObj.questionId ) {
            if( answerObj.answer != "-1" || answerObj.answer.length > 0 ){
              required[index].answered = true;
            }
          }
        })
      })
    }

    return required.every( obj => obj.answered === true );
  }
  
  function checkWordLength(answers: any, length: number){
    let achieved = false;
    answers.forEach( (section: any) => {
      section.forEach( (answerObj:any) => {
        if( answerObj.questionId === "CIQfZfjIB9so9zoTAEuJ" || answerObj.questionId === "vK442vMImlEPzkDbuLEK") {
          for(  let index = 0; index < answerObj.answer.length; index++ ) {
            let field = answerObj.answer[index];
            if( field && field.split(" ").length >= length ) achieved = true;
          }
        }
        if( typeof(answerObj.answer) === "string" && answerObj.answer.split(" ").length >= length ) {
          achieved = true;
        }
      })
    })
    return achieved;
  }

  function checkAmountOfWordLength(answers: any, length: number){
    let achieved: any = [];
    answers.forEach( (section: any) => {
      section.forEach( (answerObj:any) => {
        if( answerObj.questionId === "CIQfZfjIB9so9zoTAEuJ" || answerObj.questionId === "vK442vMImlEPzkDbuLEK") {
          for(  let index = 0; index < answerObj.answer.length; index++ ) {
            let field = answerObj.answer[index];
            if( field && field.split(" ").length >= length ) achieved.push(true);
          }
        }
        if( typeof(answerObj.answer) === "string" && answerObj.answer.split(" ").length >= length ) {
          achieved.push(true);
        }
      })
    })
    return achieved.length;
  }
  
  function checkShakespear(badges: any, answers: any){
    let achieved = false;
    const amountAboveTwenty = checkAmountOfWordLength(answers, 20);
    if( badges[5] && amountAboveTwenty > 1){
      achieved = checkWordLength(answers, 50);
    }
    return achieved;
  }


  function checkSubmission(){
    const submit = window.location.toString().split("/")[6] === "submit";
    return submit;
  }