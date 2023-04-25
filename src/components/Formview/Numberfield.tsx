import { TextField } from "@mui/material";
import { useState } from "react";

export default function NumberField({data: {multiline, required, answer}, placeholder}: any){

    const [value, setValue] = useState<string>(answer);

    function handleChange(event: any){
        let value = event.target.value;
        const regex = /^[0-9\b]+$/;
        if (value === "" || regex.test(value)) {
            if( value.length > 4 ) value = value.slice(0, 4);
            setValue(value)
        }
    }

    return <TextField
        id="standard-basic"
        placeholder={placeholder}
        variant="standard"
        fullWidth={multiline}
        required={required}
        value={value}
        onChange={handleChange}
    />
}