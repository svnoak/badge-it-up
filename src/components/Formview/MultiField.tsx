import { Stack, TextField } from "@mui/material";
import styles from "@/styles/Textfield.module.css";
import { useState } from "react";
import logUserAction from "@/lib/logUserAction";

export default function Multifield({data: {id, multiline, required, answer}, _updateState, formtexts: { textfield }, oid}: any){

    try{
        answer = JSON.parse(answer);
    } catch(err){
        answer = [undefined, undefined, undefined];
    }

    const [answers, setAnswers] = useState<string[] | undefined[]>([answer[0], answer[1], answer[2]]);
    
    function handleBlur(event: any){
        const index = event.target.id;
        const value = event.target.value;
        const answerArray: any = [...answers];
        answerArray[index] = value;
        setAnswers(answerArray);
        if(
            !(event.relatedTarget?.parentElement?.parentElement?.parentElement && 
            event.relatedTarget.parentElement.parentElement.parentElement.id === id) 
        ){
            let minimum = [false, false, false];
            
            answerArray.forEach( (answer: string | undefined, index: number) => {
                if( !(answer === "" || !answer) ) minimum[index] = true;
            })

            if( minimum.every( i => i === false ) ){
                _updateState(id, answerArray, true);
            } else {
                _updateState(id, answerArray, false);
            }
        }
    }

    function handleFocus() {
        //logUserAction(`clicking on ${id}`, {}, localStorage.getItem(oid) as string);
    }

    return (
        <Stack className="multifield" id={id}>
            <TextField
                id="0"
                placeholder={textfield}
                variant="standard"
                multiline={multiline}
                fullWidth={multiline} 
                required={required}
                defaultValue={answers[0]}
                className={styles.placeholder}
                onBlur={handleBlur}
                onFocus={handleFocus}
            />
            <TextField
                id="1"
                placeholder={textfield}
                variant="standard"
                multiline={multiline}
                fullWidth={multiline} 
                defaultValue={answers[1]}
                className={styles.placeholder}
                onBlur={handleBlur}
                onFocus={handleFocus}
            />
            <TextField
                id="2"
                placeholder={textfield}
                variant="standard"
                multiline={multiline}
                fullWidth={multiline} 
                defaultValue={answers[2]}
                className={styles.placeholder}
                onBlur={handleBlur}
                onFocus={handleFocus}
            />
    </Stack>
    )
}