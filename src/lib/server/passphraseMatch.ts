import crypto from 'crypto-js'

export default function passphraseMatch(docData: any, encryptedPassphraseString: string){
    const {key, passphrase} = docData;

    const decryptedPassphrase = crypto.AES.decrypt(encryptedPassphraseString, key).toString(crypto.enc.Utf8);

    if( decryptedPassphrase === passphrase ) {
        return true;
    } else {
        return false;
    }
}