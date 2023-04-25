import { Button, Typography } from "@mui/material";
import { Stack } from "@mui/system";

export default function BadgeDetail({data, lang, showBadgeHandler}: any){

    const folder = data.active ? "active" : "inactive";
    const text = data.active ? "success" : "description";
    const fileName = `badge${data.index}.png`

    const src = `/badges/${folder}/${fileName}`;

    const buttonText: any = {
        sv: "Tillbaka",
        en: "Back"
    }

    return (
        <Stack spacing={2} display="flex" alignItems={"center"} justifyContent={"center"} height={"100%"}>
            <div style={{display: "flex", alignItems:"center", flexDirection:"column"}}>
            <img  src={src} height={"200px"} width={"auto"}/>
            <Typography variant="h5" fontWeight={"bold"}>{data.badge[lang].title}</Typography>
            <Typography variant="body1" textAlign={"center"}>{data.badge[lang][text]}</Typography>
            </div>
            <Button variant="contained" onClick={(event) => showBadgeHandler(event)}>{buttonText[lang]}</Button>
        </Stack>
    )
}