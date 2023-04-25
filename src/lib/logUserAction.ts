import { ConstructionOutlined } from "@mui/icons-material";

export default function logUserAction(action: string, userActionObject: { 
    oid?: string, 
    uuid?: string, 
    element?: string, 
    questionId?: string, 
    answer?: string, 
    lang?: string;
    [key: string]: string | undefined;
    },
    localStorageString?: string){

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

    Object.entries(userActionObject).forEach( ([key, value]: [key: string | undefined, value: string | undefined]) => {
        if( key ){
            data[key] = userActionObject[key];
        }
    })

    if( localStorageString ){
        const localStorageObject = JSON.parse(localStorageString);

        if( localStorageObject ){
            Object.entries( localStorageObject ).forEach(([key, value]:[key: string, value: any]) => {
                if( !data[key] && key !== "answers" ) {
                    data[key] = value;
                }
            });
        }
    }

    fetch( "/api/action", {
        method: "POST",
        body: JSON.stringify(data)
    })
    }
