import { RadioGroup, FormControlLabel, Radio, Typography } from "@mui/material";

export default function Radioelement(props: any){
    return (
        <RadioGroup
        aria-labelledby="radio-group"
        name="radio-buttons-group"
        >
            {props.data.options.map((option: string, index: number) => {
                return <FormControlLabel 
                        key={index} 
                        value={index} 
                        control={<Radio size="small" />} 
                        label={<span style={{ fontSize: '11pt' }}>{option}</span>} 
                        sx={{fontSize: 6}}
                        />
            })}
        </RadioGroup>
    )
}