import { firebaseAdmin } from "@/lib/server/firebaseAdmin";
import logUserRequests from "@/lib/server/logUserRequests";
import passphraseMatch from "@/lib/server/passphraseMatch";
import { NextApiRequest, NextApiResponse } from "next";

export default async function saveAnswer(request: NextApiRequest, response: NextApiResponse) {
    const userString = request.body;
    const userObject = JSON.parse(userString);
    const {answers, badges, uuid, oid, gamified, lang, passphrase } = userObject;

    const docRef = firebaseAdmin.firestore().collection('respondents').doc(uuid);

    docRef.get()
    .then( doc => {
        if( doc.exists ){
            const data = doc.data();
            const allowed = passphraseMatch(data, passphrase);
            if( allowed ) {
                const updatedData = {
                    badges,
                    answers: JSON.stringify(answers),
                };
            
                docRef.update(updatedData)
                .then(() => {
                    logUserRequests("successfully saved answer to firestore", {oid, uuid, lang, gamified} );
                    response.status(200).json("success");
                })
                .catch((error) => {
                    console.error(error);
                    logUserRequests(`failed to save answer to firestore: ${error}`, {oid, uuid, lang, gamified} );
                    response.status(400).json(error);
                })
            } else {
                response.status(400);
            }
        }
    })

    
}