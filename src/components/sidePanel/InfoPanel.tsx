import { CardContent, Stack, Typography } from "@mui/material";
import styles from "@/styles/Sidepanel.module.css";
import logUserAction from "@/lib/logUserAction";
import cookie from 'js-cookie';

export default function InfoPanel({ lang, oid, expanded, setExpanded}:{lang: string, oid: string, expanded: boolean, setExpanded: Function}){


  function handleExpansion(event: any){
    event.stopPropagation();
    logUserAction(`expanding info area`, {}, localStorage.getItem(oid) as string);
    setExpanded(true);
  }

  const infoText: any = {
    sv: 
      {
        title: "Tänk gärna på att svara:",
        items: [
          "på alla frågor, även de frivilliga",
          "med minst 20 ord på minst ett fritextfält",
          "med minst 50 ord på minst ett fritextfält",
          "på alla frågor om enkäten i slutet",
        ]
      },
    en:
    {
      title: "Be kind to keep in mind to answer:",
      items: [
        "all the questions, even those not required",
        "minimum 20 words in at least one text field",
        "minimum 50 words in at least one text field",
        "all the questions about the survey in the end",
      ]
    },
    }

  return(
    <CardContent className={`${styles.infoPanel}`} onClick={handleExpansion}>
      <Typography variant="h6" textAlign={"center"} fontSize={"bold"} className={`${styles.header}`}>{infoText[lang].title}</Typography>
      <Stack>
      { infoText[lang].items.map( (item: string, index: number) => <Typography key={index} variant="body2" textAlign={"center"} gutterBottom className={styles.infoText}>- {item}</Typography> ) }
      </Stack>
    </CardContent>
  )
}