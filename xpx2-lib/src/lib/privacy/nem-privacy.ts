import { crypto } from 'nem2-library';
import { KeyPair } from "../model/common/keypair";

export class NemPrivacyStrategy {

    
    private keypair: KeyPair;

    constructor(key: KeyPair) {
        this.keypair = key;
    }

    public encrypt(message:any) : any{
        return crypto.encode(this.keypair.privateKey,this.keypair.publicKey,message);
    }

    public decrypt(message:any) : any {
        return crypto.decode(this.keypair.privateKey,this.keypair.publicKey, message);
    }
}