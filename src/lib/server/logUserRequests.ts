import sendToPubSub from "./action";

export default function logUserRequests(action: string, userActionObject: { 
    oid: string,
    uuid?: string,
    lang?: string,
    gamified?: boolean;
    [key: string]: string | boolean | undefined;
    }){

    interface DataObject {
        [key: string]: string | boolean | undefined;
        oid: string | undefined,
        uuid: string | undefined,
        gamified?: boolean,
        action: string,
        element?: string,
        answer?: string,
        lang?: string
    }

    let data: DataObject = {
        action: action,
        oid: undefined,
        uuid: undefined
    };

    Object.entries(userActionObject).forEach( ([key, value]: [key: string | undefined, value: string | boolean |undefined]) => {
        if( key ){
            data[key] = userActionObject[key];
        }
    })

    sendToPubSub(data);

    }
