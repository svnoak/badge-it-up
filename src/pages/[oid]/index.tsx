import Head from 'next/head'
import { Button, ButtonProps, Card, CardContent, Container, Divider, Stack, Typography, styled } from '@mui/material';
import { OrganisationExists } from '@/pages/api/OrganisationExists';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/router';
import logUserAction from '@/lib/logUserAction';
import logUserRequests from '@/lib/server/logUserRequests';
import cookie from 'js-cookie';
import { purple } from '@mui/material/colors';
import { useEffect } from 'react';

export async function getServerSideProps(context: any){
  const { oid } = context.query;
  const uuid = uuidv4();
  const exists = await OrganisationExists(oid);

  if( !exists ) {
    logUserRequests(`failed request: no organisation ${oid}`, {oid, uuid} );
    return { notFound: true }
  }
  logUserRequests(`successfull request: /${oid}`, {oid, uuid} );
  return {
    props: {
      oid,
      uuid
    }
  }
}

export default function Home({oid, uuid}: any) {
  const router = useRouter();

  useEffect(() => {
    if( localStorage.getItem(oid) ){
      const passphrase = JSON.parse(localStorage.getItem(oid) as string).passphrase;
      if( passphrase != "undefined" ) {
        uuid = JSON.parse(localStorage.getItem(oid) as string).uuid;

        // We only set a cookie if they already started filling out the survey and thus have accepted our terms
        cookie.set(oid, uuid, {path: "/"});
        cookie.set("passphrase", passphrase,  {path: "/"});
      }
    }
  })
  
  function handleButtonClick(lang: string){
    logUserAction(`clicking on language button`, {oid, uuid, lang});
    router.push(`${oid}/${lang}/intro`);
  }

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
          <Typography variant='h4' sx={{textTransform: "uppercase"}}>Volontärenkät</Typography>
          </CardContent>
        </Card>
        <Card variant="outlined">
          <CardContent>
            <Stack spacing={2} justifyContent={"center"}>
              <div>
                <Typography textAlign={"center"} variant='body1'>Vilket språk vill du se enkäten på?</Typography>
                <Typography textAlign={"center"} variant='body1'>Which language do you want to see the survey in?</Typography>
              </div>
              <Stack spacing={1.5} direction={"row"} justifyContent={'space-evenly'}>
                <ColorButton variant={"contained"} color='primary' onClick={() => handleButtonClick("sv")}>Svenska</ColorButton>
                <ColorButton variant={"contained"} color='primary' onClick={() => handleButtonClick("en")}>English</ColorButton>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
        <Typography variant='caption'>You can opt out afterwards here / Du kan dra tillbaka ditt deltagande i efterhand här: <a href={`https://survey-56o7i4xkoa-lz.a.run.app/${oid}/opt-out`}>opt out</a></Typography>
        </Stack>
      </Container>
      </main>
    </>
  )
}
