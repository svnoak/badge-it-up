import { firebaseAdmin } from "@/lib/server/firebaseAdmin";

export default async function getLatestCompletedSection(uuid: string){
    const docRef = firebaseAdmin.firestore().collection("respondents").doc(uuid);
    const doc = await docRef.get();
    if( doc.exists ){
        const data: any = doc.data();
        const sections = data.sections;
        let latest = -1;
        for (let index = 0; index < sections.length; index++) {
            if( sections[index] ) {
                latest = index;
            } else {
                break;
            }
        }
        return latest;
    }
    return null;
}