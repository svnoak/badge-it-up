export default async function sendToPubSub( userActionObject: any ){

        const { oid, uuid, gamified, action, element, questionId, answer, badgeId, lang } = userActionObject;
        const { PubSub } = require('@google-cloud/pubsub');
    
        const pubsub = new PubSub();
        const topicName = 'action';

        const data = {
            tableId: process.env.TABLE_ID,
            timestamp: new Date(),
            oid,
            uuid,
            gamified,
            action,
            element,
            questionId,
            answer,
            badgeId,
            lang
        }

        const dataBuffer = Buffer.from(JSON.stringify(data));
    
        pubsub
        .topic(topicName)
        .publish(dataBuffer)
        .then(() => {
            return;
        })
        .catch((err: any) => {
            console.error('ERROR:', err);
            return;
        });
}