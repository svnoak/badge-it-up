export default function saveAnswerInLocalStorage(pid: number, questionId: string, answer: string, oid: string) {
  const localStorageObject = JSON.parse(localStorage.getItem(oid) as string);
  
  if( typeof(answer) === "object" ) answer = JSON.stringify(answer);

  // Get the answers array from the object
  const { answers } = localStorageObject;

  // Find the index of the existing answer object with the same question ID, if any
  const answerIndex = answers[pid - 1].findIndex((answer: any) => answer.questionId === questionId);

  if (answerIndex !== -1) {
    // If an existing answer was found, overwrite it with the new answer
    answers[pid - 1][answerIndex].answer = answer;
  } else {
    // If no existing answer was found, add the new answer object to the answers array
    const newAnswer = { questionId, answer: answer };
    answers[pid - 1].push(newAnswer);
  }

  const localStorageString = JSON.stringify(localStorageObject);

  // Set the updated storage value
  localStorage.setItem(oid, localStorageString);
}
