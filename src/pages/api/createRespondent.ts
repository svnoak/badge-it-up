import { firebaseAdmin } from "@/lib/server/firebaseAdmin";
import logUserRequests from "@/lib/server/logUserRequests";

/**
 * Will return true if document with uuid could be created and false if uuid already exists in database.
 * @param uuid that was generated for the user cookie.
 */
export async function createRespondent(storageObject: any, key: string, passphrase: string, userAgent: string) {
    const {uuid, oid, gamified, lang} = storageObject;

    const collectionRef = firebaseAdmin.firestore().collection('respondents');

    const success = collectionRef.doc(uuid).get()
    .then( async (doc) => {
        if( doc.exists ) {
            logUserRequests(`UUID already exists in firestore, abort`, {oid, uuid, gamified, lang});
            return false;
        } else {
            const newDocRef = collectionRef.doc(uuid);

            const newDocData = {
                sections: [false, false, false],
                badges: [false, false, false, false, false, false, false],
                organisation: oid,
                gamified,
                key,
                passphrase,
                userAgent
            };
            try {
                await newDocRef.set(newDocData);
                logUserRequests(`respondent created in firestore`, {oid, uuid, gamified, lang});
                return true;
            } catch (error) {
                logUserRequests(`respondent creation failed ${error}`, {oid, uuid, gamified, lang});
                return false;
            }
        }
    } )
    return success;
}