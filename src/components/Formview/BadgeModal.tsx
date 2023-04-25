import { Button, Card, CardActionArea, CardContent, CardHeader, CardMedia, Stack, Typography } from "@mui/material";
import styles from "@/styles/BadgeModal.module.css";
import { style } from "@mui/system";
import { useRouter } from "next/router";

export default function BadgeModal({badges, index, lang, setShowBadge}: any){

    function clickHandler(){
        setShowBadge({show: false, index: -1});
    }

    const router = useRouter();
    const submitPage = router.pathname.split("/")[4] === "submit";
    const marginTop = submitPage ? "-10px" : "0";

    const src = `/badges/active/badge${index}.png`;
    return (
        <div className={styles.backdrop} style={{marginTop: marginTop}}>
            { (index > -1) && <div className={styles.confetti}></div>}
            <Card style={{borderRadius: "8px"}}>
                <CardContent style={{textAlign: "center"}}>
                    <Stack spacing={2} display="flex" alignItems={"center"}>
                        <img src={src} alt="" style={{height: "150px", width: "auto"}}/>
                        <div>
                        <Typography variant="h3">{badges[index].badge[lang].title}</Typography>
                        <Typography variant="body1">{badges[index].badge[lang].success}</Typography>
                        </div>
                        <Button variant="contained" style={{height: "50px", width: "250px"}} onClick={clickHandler}>
                            OK!
                        </Button>
                    </Stack>
                </CardContent>
            </Card>
        </div>
    )
};