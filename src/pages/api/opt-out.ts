import { NextApiRequest, NextApiResponse } from "next";
import serverCookie from 'cookie';
import passphraseMatch from "@/lib/server/passphraseMatch";
import { firebaseAdmin } from "@/lib/server/firebaseAdmin";
import { DocumentReference } from "firebase-admin/firestore";
import logUserRequests from "@/lib/server/logUserRequests";

export default async function OptOut(request: NextApiRequest, response: NextApiResponse) {
    const {oid, uuid} = JSON.parse(request.body);
    const cookies = request.headers.cookie as string;
    const passphrase = serverCookie.parse(cookies)["passphrase"];

    if( uuid ) {
        const docRef: DocumentReference = firebaseAdmin.firestore().collection('respondents').doc(uuid);
        const doc = await docRef.get();
        if( doc.exists ){
            const data = doc.data();
            if( data ){
                const allowed = passphraseMatch(data, passphrase);
                if( allowed ) {
                    const updatedData = {
                        delete: true
                    };
                    docRef.update(updatedData)
                    .then(() => {
                        logUserRequests("successfully opted out", {oid, uuid} );
                        response.status(200).json("success");
                        return;
                    })
                    .catch((error) => {
                        console.error(error);
                        logUserRequests(`failed to opt out: ${error}`, {oid, uuid} );
                        response.status(400).json(error);
                        return;
                    })
                } else {
                    response.status(400);
                    return;
                }
            }
            response.status(400);
        }
        response.status(400);
    }
    response.status(400);
}