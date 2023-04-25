import { CollectionReference } from "firebase-admin/firestore";
import { firebaseAdmin } from "../../../lib/server/firebaseAdmin";
export async function loadBadges(){
    const collectionRef: CollectionReference = firebaseAdmin.firestore().collection('badges');;
    const query = collectionRef.orderBy("index");
    const docs = await query.get();
    const badges: { id: string; }[] = [];
    docs.forEach( doc => {
        const obj = {
            id: doc.id,
            ...doc.data()
        }
        badges.push(obj);
    })
    return badges;
}