import { NextApiRequest, NextApiResponse } from "next";
import { OrganisationExists } from "./OrganisationExists";
import { createRespondent } from "./createRespondent";
import logUserRequests from "@/lib/server/logUserRequests";
import setGamified from "@/lib/server/setGamified";
import serverCookie from 'cookie';
import crypto from 'crypto-js';
import generateSecret from "@/lib/server/generateSecret";

export default async function initialize(request: NextApiRequest, response: NextApiResponse){

    const { oid, lang, uuid, localStorageExists, userAgent } = JSON.parse(request.body);
    const { cookie } = request.headers;

    let storageObjectData;

    if( cookie && localStorageExists ) {
      const uuid = serverCookie.parse(cookie)[oid];
      if( uuid ) {
          const exists = await OrganisationExists(oid);
          if( !exists ) {
            logUserRequests(`invalid cookie: oid in cookie does not exist in firestore`, {oid, lang, uuid});
            response.status(403).json(null);
            return;
          }
        }
      logUserRequests(`re-accepting terms`, {oid, uuid, lang});
      response.status(200).json(null);
      return;
    }

    let gamified = await setGamified(oid);

    const key: string = crypto.lib.WordArray.random(128/8).toString();
    const passphrase: string  = generateSecret();
    const encryptedPassphrase = crypto.AES.encrypt(passphrase, key).toString();

    storageObjectData = createInitialStorageObject(oid, uuid, lang, gamified, encryptedPassphrase);

    const exists = await OrganisationExists(oid);
    if(!exists) response.status(400);

    const storageObjectString = JSON.stringify(storageObjectData);

    const success = await createRespondent(storageObjectData, key, passphrase, userAgent);
    if( success ){
      response.status(200).json(storageObjectString);
    } else {
      response.status(400);
    }
}

function createInitialStorageObject(oid: string, uuid: string, lang: string, gamified: boolean, passphrase: string){

  const storageObjectData = {
    uuid,
    answers: [
      [],
      [],
      [],
    ],
    badges: [false,false,false,false,false,false,false,false,],
    oid,
    lang,
    gamified,
    passphrase
  }

  return storageObjectData;
}