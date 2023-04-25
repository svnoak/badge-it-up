import { firebaseAdmin } from "@/lib/server/firebaseAdmin";

export async function OrganisationExists(oid: string) {
        const docRef = firebaseAdmin.firestore().collection('organisations').doc(oid);
        const doc = await docRef.get();
        if (doc.exists) {
            const document =  {...doc.data()}
            return document.name;
        } else {
            return false;
        }
    }