import logUserAction from "@/lib/logUserAction";
import { InputAdornment, OutlinedInput, Stack, TextField } from "@mui/material";
import { InputHTMLAttributes, RefObject, useRef, useState } from "react";
import cookie from 'js-cookie';
import { useRouter } from "next/router";

export default function Time({data: {id, answer}, _updateState, changeErrorState}: {data: {id: string, answer: string}, _updateState: Function, changeErrorState:Function}) {

    const router = useRouter();
    const { oid } = router.query;

    const [value, setValue] = useState<string>("");
    const [focus, setFocus] = useState<boolean>(false);
    const minRef: any = useRef();
    const secRef: any = useRef();
    
    let answerArray: string[] = [];
    if( answer ){
        const arr = answer.split(":");
        answerArray[0] = arr[0];
        answerArray[1] = arr[1];
    }

    const [minutes, setMinutes] = useState<string>(answerArray[0]);
    const [seconds, setSeconds] = useState<string>(answerArray[1]);

    function handleBlur(event: any){
        if(
            !(event.relatedTarget?.parentElement?.parentElement?.parentElement && 
            event.relatedTarget.parentElement.parentElement.parentElement.classList.contains("time")) 
        ){
            const min = minRef.current.value || "";
            const sec = secRef.current.value || "";
            const answerString = `${min}:${sec}`;
            _updateState(id, answerString, false);
            setFocus(false);
        }
    }

    function handleFocus(){
        if( !focus ){
            setFocus(true);
            logUserAction(`clicking on ${id}`, {}, localStorage.getItem(oid as string) as string);
        }
    }

    function handleChange(event: any){
        const id = event.target.id;
        let value = event.target.value;
        const regex = /^[0-9\b]+$/;
        if (value === "" || regex.test(value)) {
            if( id === "min" ) {
                if( value.length > 3 ) value = "999";
                setMinutes(value);
            } else {
                if( value > 59 ) value = 59;
                setSeconds(value);
            }
            setValue(`${minutes}:${seconds}`)
        }
    }

    return (
        <Stack onBlur={handleBlur} onFocus={handleFocus} className="time" direction={"row"} spacing={2}>
        <TextField
            value={minutes}
            variant="standard"
            onChange={handleChange}
            id="min"
            InputProps={{
                endAdornment: <InputAdornment position="end">min</InputAdornment>,
                inputProps: {
                    style: { textAlign: "right" },
                }
            }}
            inputRef={minRef}
            sx={{width: "70px"}}
        />
        <TextField
            value={seconds}
            variant="standard"
            onChange={handleChange}
            id="sec"
            InputProps={{
                endAdornment: <InputAdornment position="end">sec</InputAdornment>,
                inputProps: {
                    style: { textAlign: "right" },
                }
            }}
            inputRef={secRef}
            sx={{width: "70px"}}
        />
        </Stack>
    );
}