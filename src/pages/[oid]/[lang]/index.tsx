export async function getServerSideProps(context: any){
    let {oid, lang} = context.query;
    return { redirect: {permanent: false, destination: `/${oid}/${lang}/intro`} }
}

export default function Index(){
    return;
}