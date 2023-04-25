import Image from "next/image";

export default function Badge({badge, active, index, showBadgeHandler} : {badge: any, active: boolean, index: number, showBadgeHandler: any}){

    const folder = active ? "active" : "inactive";
    const fileName = `badge${index}.png`;

    const src = `/badges/${folder}/${fileName}`;

    return (
            <img src={src} alt="" style={{maxWidth: "80px", cursor:"pointer"}} onClick={(event) => showBadgeHandler(event, badge)}/>
    )
}