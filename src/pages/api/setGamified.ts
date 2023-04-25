import { firebaseAdmin } from "@/lib/server/firebaseAdmin";
import logUserRequests from "@/lib/server/logUserRequests";
import passphraseMatch from "@/lib/server/passphraseMatch";
import { NextApiRequest, NextApiResponse } from "next";
import cookie from 'cookie';

export default async function setGamified(request: NextApiRequest, response: NextApiResponse) {
    const userString = request.body;
    const userObject = JSON.parse(userString);
    const cookies = request.headers.cookie as string;
    const passphrase = cookie.parse(cookies)["passphrase"];
    const {uuid, oid, gamified, lang, devMode } = userObject;

    const docRef = firebaseAdmin.firestore().collection('respondents').doc(uuid);

    docRef.get()
    .then( doc => {
        if( doc.exists ){
            const updatedData = {
                gamified: devMode
            };
            const allowed = passphraseMatch(doc.data(), passphrase);
            if( allowed ) {
                docRef.update(updatedData)
                .then(() => {
                    logUserRequests("successfully updated gamificaiton to firestore", {oid, uuid, lang, gamified} );
                    response.status(200).json("success");
                })
                .catch((error) => {
                    console.error(error);
                    logUserRequests(`failed to update gamificatino to firestore: ${error}`, {oid, uuid, lang, gamified} );
                    response.status(400).json(error);
                })
            }
        } else {
            response.status(400);
        }
    })
}