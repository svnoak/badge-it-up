import { Button, Card } from "@mui/material";
import BadgePanel from "./BadgePanel";
import InfoPanel from "./InfoPanel";
import styles from "@/styles/Sidepanel.module.css";
import { useEffect, useState } from "react";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import logUserAction from "@/lib/logUserAction";

export default function SidePanel({gamified, lang, badges, oid, submitPage}: {gamified: boolean, lang: string, badges?: any, oid: string, submitPage: boolean}){
    const [expanded, setExpanded] = useState<boolean>(false);
    const [showBadge, setShowBadge] = useState(false);

    function clickHandler(event: any, expand: boolean){
        event.stopPropagation();
        if( expand ){
            logUserAction("expanding infoArea", {}, localStorage.getItem(oid) as string);
        } else {
            logUserAction("minimizing infoArea", {}, localStorage.getItem(oid) as string);
        }
        setExpanded(expand);
    }

    useEffect(() => {
    },[expanded])
    return(
        <Card
            className={`${styles.sidepanel_inner} ${expanded || submitPage ? styles.expanded : ""} ${submitPage ? styles.submitPage : ""}`}
            variant="outlined"
            >
        {
        gamified ?
        <BadgePanel lang={lang} badgesArray={badges} showBadge={showBadge} setShowBadge={setShowBadge} oid={oid} expanded={expanded} setExpanded={setExpanded} submitPage={submitPage}/> :
        <InfoPanel lang={lang} oid={oid} expanded={false} setExpanded={setExpanded} />
        }
        {
        !showBadge && (
        !expanded ? 
        <Button className={styles.badgePanel_arrow} id={styles.badgePanelArrow} onClick={(event) => clickHandler(event, true)}><ExpandMoreIcon /></Button> :
        <Button className={styles.badgePanel_arrow} id={styles.badgePanelArrow} onClick={(event) => clickHandler(event, false)}><ExpandLessIcon /></Button>
        )
      }
        </Card>
    )
}