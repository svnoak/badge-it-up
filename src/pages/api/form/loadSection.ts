import { CollectionReference } from "firebase-admin/firestore";
import { firebaseAdmin } from "../../../lib/server/firebaseAdmin";
export async function loadFormQuestions(pid: number){
    const collectionRef: CollectionReference = firebaseAdmin.firestore().collection('questions');
    const query = collectionRef.where("section", "==", pid).orderBy("position");
    const docs = await query.get();
    const questions: { id: string; }[] = [];
    docs.forEach( doc => {
        const obj = {
            id: doc.id,
            ...doc.data()
        }
        questions.push(obj);
    })
    return questions;
}