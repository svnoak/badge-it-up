import { DocumentReference } from "firebase-admin/firestore";
import { firebaseAdmin } from "../../../lib/server/firebaseAdmin";
import crypto from 'crypto-js'
import passphraseMatch from "@/lib/server/passphraseMatch";

export async function loadRespondentObject(uuid: string, encryptedPassphraseString: string){
    const docRef: DocumentReference = firebaseAdmin.firestore().collection('respondents').doc(uuid);
    const doc = await docRef.get();
    if( doc.exists ){
        const data = doc.data();
        if( data ){
            const allowed = passphraseMatch(data, encryptedPassphraseString);
            delete data.key;
            delete data.passphrase;
            if( allowed ){
                return data;
            } else {
                return null;
            }
        }
    }
    return null;
}