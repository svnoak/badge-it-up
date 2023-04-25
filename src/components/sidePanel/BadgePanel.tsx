import { Button, CardContent, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import Badge from "./Badge";
import BadgeDetail from "./BadgeDetail";
import styles from "@/styles/Sidepanel.module.css";
import logUserAction from "@/lib/logUserAction";


export default function BadgePanel({ lang, badgesArray, showBadge, setShowBadge, oid, expanded, setExpanded, submitPage}:{lang: string, badgesArray: any, showBadge: boolean, setShowBadge: Function, oid: string, expanded: boolean, setExpanded: Function, submitPage: boolean}){

  const [focusedBadge, setFocusedBadge] = useState({});
  const [badges, setBadges] = useState<any>(badgesArray);
  
  useEffect(() => {
    setBadges(badgesArray);
  }, [showBadge, badgesArray]);

  function handleExpansion(event: any){
    event.stopPropagation();
    if( !expanded ) logUserAction(`expanding info area`, {},localStorage.getItem(oid) as string);
    setExpanded(true);
  }

  const type = submitPage ? "submit" : "pid";

  const panelText: any = {
    submit: {
      sv: {
        title: "Dessa märken har du tjänat ihop!",
        text: "",
      },
      en: {
        title: "These are all the badges you earned!",
        text: ""
      }
    },
    pid: {
      sv: {
        title: "Kan du tjäna ihop alla märken?",
        text: "Klicka på märket för att läsa hur",
      },
      en: {
        title: "Can you earn all the badges?",
        text: "Click on the badge to read how"
      }
    }
  }

  function showBadgeHandler(event: any, badge: any){
    event.stopPropagation();
    if(window.innerWidth < 1200 && !expanded) return;
      if( !showBadge ) {
        logUserAction(`clicking on badge ${badge.index}`, {}, localStorage.getItem(oid) as string);
      } else {
        logUserAction(`clicking on badge backbutton`, {}, localStorage.getItem(oid) as string);
      }
      setShowBadge(!showBadge);
      setFocusedBadge(badge);
    }

  return(
      <CardContent className={`${styles.badgePanel}`} onClick={handleExpansion}>
      {
        showBadge ?
        <BadgeDetail data={focusedBadge} lang={lang} showBadgeHandler={showBadgeHandler}/>
        :
      badges && 
      <>
      <Typography variant="h6" textAlign={"center"} fontSize={"bold"} className={`${styles.header}`}>{panelText[type][lang].title}</Typography>
      <Typography variant="body1" textAlign={"center"} gutterBottom className={styles.body}>{panelText[type][lang].text}</Typography>
      <Stack className={styles.badgeGrid} display={"grid"}>
          {badges.map( (badge: any, index: number) => <Badge active={badge.active} index={index} key={index}  badge={badge} showBadgeHandler={showBadgeHandler}/> )}
      </Stack>
      </>
      }
      
    </CardContent>
    
  )
}