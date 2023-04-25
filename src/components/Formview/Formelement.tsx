import { Alert, Card, CardContent, Grid, Stack, Typography } from "@mui/material";
import Dropdown from "./Dropdown";
import Radio from "./Radioelemt";
import Textfield from "./Textfield";
import Time from "./Time";
import Numberfield from "./Numberfield";
import styles from "@/styles/Form.module.css";
import { useEffect, useState } from "react";
import logUserAction from "@/lib/logUserAction";
import { useRouter } from "next/router";
import Multifield from "./MultiField";

export default function Formelement({data, question, _updateState, rerender, errorState, formtexts}: {data: {field: string, id: string, required: boolean}, question: {description: string, title: string}, _updateState: Function, rerender: boolean, errorState: boolean, formtexts: any}){

    const router = useRouter();
    const oid: string = router.query.oid as string;

    const errorColor = "#d93025";
    const defaultColor = "#dadce0";

    const [cardBorderColor, setCardBorderColor] = useState<string>(defaultColor);

    const formElements: any = {
        dropdown: Dropdown,
        textfield: Textfield,
        radio: Radio,
        time: Time,
        numberfield: Numberfield,
        multifield: Multifield,
    }

    let errorMessage = formtexts.error;

    if( data.field === "numberfield" ) {
        errorMessage = formtexts.birthdate;
    } else if ( data.field === "multifield" ){
        errorMessage = formtexts.multifield;
    }


    useEffect(() => {
        errorState ? 
        setCardBorderColor(errorColor) : 
        setCardBorderColor(defaultColor);
    },[errorState, rerender])

    function handleBlur(event: any){
        if( event && data.field !== "dropdown" || (data.field === "dropdown" && event.target.tagName === undefined ) ){
            if( data.required && data.field !== "dropdown" && data.field !== "numberfield" && data.field !== "multifield"){
                if (!event.target.value) {
                    _updateState(data.id, event.target.value, true);
                } else {
                    _updateState(data.id, event.target.value, false);
                }
            } else if ( data.field === "numberfield" ) {
              if( event.target.value.length < 4 ) {
                _updateState(data.id, event.target.value, true);
              } else {
                _updateState(data.id, event.target.value, false);
              }
            } else if( data.field !== "dropdown" && data.field !== "time" && data.field !== "multifield" ) {
                _updateState(data.id, event.target.value, false);
            } else if( data.field === "multifield" ) {
            }
        }
    }

    function changeErrorState(state: boolean){
        errorState = state;
    }

    function handleChange(event: any){
        if( data.field != "textfield" && data.field != "numberfield" && data.field != "multifield" ){
            _updateState(data.id, event.target.value, false, false);
        }
        
    }

    function focusHandler(event: any){
        event.stopPropagation();
        event.preventDefault();
        if( data.field !== "dropdown" && data.field !== "time" && data.field !== "multifield"){
            logUserAction(`clicking on ${data.id}`, {}, localStorage.getItem(oid) as string);
        }
    }

    const Element = formElements[data.field];
    return(
        <Card variant="outlined" sx={{ borderRadius: 2, borderColor: cardBorderColor }} onBlur={handleBlur} onFocus={focusHandler} onChange={handleChange} className={errorState ? "formCardError" : "formCard"}>
            <CardContent>
            <Grid container direction="column" spacing={1}>
                <Grid item>
                    <Typography className={styles.title} id={styles.title} gutterBottom>
                        <span>{question.title}</span>
                        { data.required ? <span className={styles.required}>*</span> : "" }
                    </Typography>
                    {question.description && <Typography className={styles.description} id={styles.description} variant="caption" color="text.secondary">{question.description}</Typography>}
                </Grid>
                <Grid item>
                    <Element data={data} question={question} _updateState={_updateState} changeErrorState={changeErrorState} formtexts={formtexts} oid={oid}/>
                </Grid>
                <Grid item>
                    {errorState && (
                    <Alert severity="error" sx={{backgroundColor: "transparent", color: errorColor}}>{errorMessage}</Alert>
                    )}
                </Grid>
            </Grid>
            </CardContent>
        </Card>
    )
}