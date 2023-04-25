import { Button, ButtonProps, Card, CardContent, Container, Divider, Stack, Typography, styled } from '@mui/material';
import { OrganisationExists } from '@/pages/api/OrganisationExists';
import logUserAction from '@/lib/logUserAction';
import logUserRequests from '@/lib/server/logUserRequests';
import cookie from 'js-cookie';
import { purple } from '@mui/material/colors';
import { useEffect, useState } from 'react';
import serverCookie from 'cookie';

export async function getServerSideProps(context: any){
    let {oid} = context.query;
    const cookies = context.req.headers.cookie;
    let uuid = null;

    if( !cookies ){
      logUserRequests(`successfull request: /${oid}/opt-out - no cookie`, {oid});
    } else {
        uuid =  serverCookie.parse(cookies)[oid];
    }

    const organisation = await OrganisationExists(oid);
    if( !organisation ) {
      logUserRequests(`failed request: /${oid}/opt-out - organisation does not exist`, {oid} );
      return { notFound: true }
    }
  
    logUserRequests(`successfull request: /${oid}/opt-out`, {oid} );
  
    return {
      props: {
        oid,
        uuid
      }
    }
  }

export default function Home({oid, uuid}: any) {  
    async function handleButtonClick(){
        logUserAction(`clicking on opt-out button`, {oid, uuid});
        const response = await fetch( "/api/opt-out", {
            method: "POST",
            body: JSON.stringify({oid, uuid})
        })

        if( response.ok ){
            alert("Din begäran av borttagning har tagits emot\n\nYour request of deletion has been received");
            localStorage.clear();
            sessionStorage.clear();
            cookie.remove(oid);
            cookie.remove("passphrase");
            window.location.reload();
        } else {
            console.log(response.statusText);
        }
    }

    useEffect(() => {
        if( localStorage.getItem(oid) ){
          const passphrase = JSON.parse(localStorage.getItem(oid) as string).passphrase;
          if( passphrase != "undefined" ) {
            uuid = JSON.parse(localStorage.getItem(oid) as string).uuid;
            cookie.set(oid, uuid, {path: "/"});
            cookie.set("passphrase", passphrase,  {path: "/"});
          }
        }
      })

    const ColorButton = styled(Button)<ButtonProps>(({ theme }) => ({
    color: theme.palette.getContrastText(purple[500]),
    backgroundColor: purple[500],
    '&:hover': {
        backgroundColor: purple[700],
    },
    }));

    return (
    <>
        <main>
        <Container maxWidth={"sm"} sx={{marginTop: "50px"}}>
        <Stack spacing={1.5}>
        <Card variant="outlined" sx={{ borderRadius: 2, borderTop: 10, borderTopColor: "rgb(103, 58, 183)" }}>
            <CardContent>
            <Typography variant='h4' sx={{textTransform: "uppercase"}}>Request of deletion / Begäran om borttagning</Typography>
            </CardContent>
        </Card>

        {
        uuid ? 
        (
        <Card variant="outlined">
            <CardContent>
                <Stack spacing={2} justifyContent={"center"}>
                <Stack spacing={1.5} justifyContent={"center"}>
                <div>
                    <Typography textAlign={"center"} variant='body1'>By clicking on the button below, you will withdraw from participating in the study.</Typography>
                    <Typography textAlign={"center"} variant='body1'>If you have submitted your answers, they will still be received by your organisation.</Typography>
                </div>
                <Divider />
                <div>
                    <Typography textAlign={"center"} variant='body1'>Genom att klicka på knappen nedan drar du tillbaka ditt deltagande i studien.</Typography>
                    <Typography textAlign={"center"} variant='body1'>Har du skickat in svaren kommer din organisation oavsett ta del av dessa.</Typography>
                </div>
                <Divider />
                </Stack>
                    <ColorButton variant={"contained"} color='primary' onClick={() => handleButtonClick()}>Withdraw from survey / Dra tillbaka deltagande</ColorButton>
                </Stack>
            </CardContent>
        </Card>
        ) :
        (
        <Card variant="outlined">
            <CardContent>
                <Stack spacing={2} justifyContent={"center"}>
                    <Typography textAlign={"center"} variant='body1'>On this page you can request to opt out, if you have filled out the survey.</Typography>
                    <Typography textAlign={"center"} variant='body1'>På denna sidan kan du dra tillbaka ditt deltagande, om du har fyllt i enkäten.</Typography>
                </Stack>
            </CardContent>
        </Card>
        )
        }

        </Stack>
        </Container>
        </main>
    </>
    )
}
