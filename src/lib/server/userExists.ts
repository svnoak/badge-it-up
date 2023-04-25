import { firebaseAdmin } from "./firebaseAdmin";

export default async function userExists(uuid: string){
    const docRef = firebaseAdmin.firestore().collection('respondents').doc(uuid);

    const userDoc = docRef.get()
    .then((doc) => {
            if( doc.exists ){
                return true;
            } else {
                return false;
            }
    })
    return userDoc;
}