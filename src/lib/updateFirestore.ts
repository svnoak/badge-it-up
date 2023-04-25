export default async function updateFirestore(oid: string){

    const response = await fetch( "/api/form/saveAnswer", {
        method: "POST",
        body: localStorage.getItem(oid),
    })

}