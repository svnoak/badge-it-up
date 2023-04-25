import { firebaseAdmin } from "./firebaseAdmin";

export default async function setGamified(oid: string){
    const docRef = firebaseAdmin.firestore().collection('organisations').doc(oid);

    let org: any;

    const gamified = docRef.get()
    .then((doc) => {
            org = {...doc.data()};
            if( org.gamified <= org.respondents / 2 ){
                org.gamified += 1;
                org.respondents += 1;
                docRef.update(org);
                return true;
            } else {
                org.respondents += 1;
                docRef.update(org)
                return false;
            }
    })

    return gamified;
}