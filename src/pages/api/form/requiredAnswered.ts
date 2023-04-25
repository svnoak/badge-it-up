import { firebaseAdmin } from "@/lib/server/firebaseAdmin";
import { NextApiRequest, NextApiResponse } from "next";
import serverCookie from 'cookie';

export default async function requiredAnswers( request: NextApiRequest, response: NextApiResponse ){
    const { cookie } = request.headers;
    const { oid } = request.query;
    const { answers } = JSON.parse(request.body);
    if( !cookie ) return;

    const uuid = serverCookie.parse(cookie)[oid as string];
    
    const pageIndex: string = request.query.pid as string;
    const pid = parseInt(pageIndex);
    
    const collectionRef = firebaseAdmin.firestore().collection("questions");
    const query = collectionRef.where("section", "==", pid).where("required", "==", true);
    const docs = await query.get();
    let unanswered: number[] = [];
    docs.forEach( (doc:any) => {
        if( doc.exists ){
            const answer = answers[pid-1].find( (answer: { questionId: string; }) => answer.questionId === doc.id );
            if( doc.id === "zjv4xxO8TUptjFvDQdRD" && (Number.isNaN(answer.answer) || answer.answer.length !== 4) ){
                answer.answer = null;
            }
            if( !answer || answer.answer === "" || answer.answer == -1 ){
                unanswered.push(doc.id);
            }
        }
    })
    if( unanswered.length < 1 ) {
        const respRef = firebaseAdmin.firestore().collection("respondents").doc(uuid);
        const resp = await respRef.get();
        if( resp.exists){
            let sections: boolean[] = resp.data()?.sections;
            if( !sections[pid-1] ) sections[pid-1] = true;
            const docRef = firebaseAdmin.firestore().collection("respondents").doc(uuid);
            docRef.update({sections});
            response.status(200).json([]);
        }
    } else {
        response.status(403).json(unanswered);
    }
}