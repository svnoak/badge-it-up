import type { NextApiRequest, NextApiResponse } from 'next'
import { stringify } from 'querystring';

export default async function Action (
    request: NextApiRequest,
    response: NextApiResponse,
  )
  {
        const { oid, uuid, gamified, action, element, questionId, answer, badgeId, lang } = JSON.parse(request.body);
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
            answer: JSON.stringify(answer),
            badgeId,
            lang
        }

        const dataBuffer = Buffer.from(JSON.stringify(data));

        pubsub
        .topic(topicName)
        .publish(dataBuffer)
        .then(() => {
            response.status(200).json({status: 200});
        })
        .catch((err: any) => {
            console.error('ERROR:', err);
            response.status(500).json({status: 500});
        });
    response.status(200);
}