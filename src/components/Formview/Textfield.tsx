import { TextField } from "@mui/material";
import styles from "@/styles/Textfield.module.css";

export default function Textfield({data: {multiline, required, answer}, formtexts: { textfield }}: any){

    return (
    <TextField
        id="standard-basic"
        placeholder={textfield}
        variant="standard"
        multiline={multiline}
        fullWidth={multiline} 
        required={required}
        defaultValue={answer}
        className={styles.placeholder}
    />
    )
}