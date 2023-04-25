import Head from 'next/head';
import { Card, CardContent, Container, Stack, Typography } from '@mui/material';
import { OrganisationExists } from '@/pages/api/OrganisationExists';
import logUserRequests from '@/lib/server/logUserRequests';
import serverCookie from 'cookie';
import { loadRespondentObject } from '@/pages/api/form/loadRespondentObject';
import getLatestCompletedSection from '@/pages/api/getLatestCompletedSection';
import { loadBadges } from '@/pages/api/form/loadBadges';
import SidePanel from '@/components/sidePanel/SidePanel';
import { useEffect, useState } from 'react';
import BadgeModal from '@/components/Formview/BadgeModal';
import badgeHandler from '@/lib/badgeHandler';
import updateFirestore from '@/lib/updateFirestore';

export async function getServerSideProps(context: any){
  let {oid, lang} = context.query;
  const cookies = context.req.headers.cookie;
  if( !cookies ){
    logUserRequests(`failed request: /${oid}/${lang}/form/submit - no cookie`, {oid, lang});
    return { redirect: {permanent: false, destination: `/${oid}/`} }
  }

  const uuid =  serverCookie.parse(cookies)[oid];
  const passphrase = serverCookie.parse(cookies).passphrase;

  let respondentObject: any;
  if( uuid ) {
    respondentObject = await loadRespondentObject(uuid, passphrase);
  } else {
    logUserRequests(`failed request: /${oid}/${lang}/form/submit - no cookie`, {oid, lang});
    return { redirect: {permanent: false, destination: `/${oid}/`} }
  }

  if( respondentObject == null ){
    logUserRequests(`failed request: /${oid}/${lang}/form/submit - wrong passphrase`, {oid, lang});
    return { redirect: {permanent: false, destination: `/${oid}/`} }
  }
  
  let gamified = respondentObject.gamified;

  const exists = await OrganisationExists(oid);
  if( !exists ) {
    logUserRequests(`failed request: /${oid}/${lang}/form/submit - organisation does not exist`, {oid, uuid} );
    return { notFound: true }
  }

  // Check if previous section has been completed and if not, redirect back.
  const latestCompletedSection = await getLatestCompletedSection(uuid);
  if( latestCompletedSection === null ) return { redirect: {permanent: false, destination: `/${oid}/`} }
  if( latestCompletedSection + 1 < 2 ){
    logUserRequests(`failed request: section before not completed`,{oid, uuid, lang})
    return { redirect: {permanent: false, destination: `/${oid}/${lang}/form/${latestCompletedSection+2}`} }
  }

  logUserRequests(`successfull request: /${oid}/${lang}/form/submit`, {oid, uuid, lang} );
  let badges = null;
  if( gamified ){
    const respondentBadges = respondentObject.badges;
    badges = (await loadBadges()).map( (badge: any, index: number) => {
      const active = respondentBadges[index] ?? false;
      return {...badge, active}
    })
  }
  
  return {
    props: {
      lang,
      gamified,
      badges,
      oid
    }
  }
}

export default function Form({ lang, gamified, oid, badges }: any) {

  const formtexts: any = {
    "sv": {
        title: "Enkät",
        text: "Tack för ditt deltagande!",
    },
    "en": {
        title: "Survey",
        text: "Thank you for your participation!",
    }
  }

  const [showBadge, setShowBadge] = useState({show: false, index: -1});
  const [badgeArray, setBadgeArray] = useState(badges);

  useEffect(() => {
    badgeHandler(oid, setShowBadge, badgeArray, setBadgeArray, gamified);
    updateFirestore(oid);
  },[])

  return (
    <>
      {
        showBadge.show && <BadgeModal badges={badges} lang={lang} index={showBadge.index} setShowBadge={setShowBadge} key={Date.now()}/>
      }
      <main style={{marginTop: "10px"}}>
        <Container maxWidth={"sm"}>
            <Stack spacing={1.5}>
                <Card variant="outlined" sx={{ borderRadius: 2, borderTop: 10, borderTopColor: "rgb(103, 58, 183)" }}>
                    <CardContent>
                    <Typography variant='h4' sx={{textTransform: "uppercase"}}>{formtexts[lang].title}</Typography>
                    <Typography variant='body2'>{formtexts[lang].text}</Typography>
                    </CardContent>
                </Card>
              {gamified && (
                <SidePanel gamified={gamified} lang={lang} oid={oid} badges={badgeArray} submitPage/>
              )
            }
            </Stack>
        </Container>
      </main>
    </>
  )
}