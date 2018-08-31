import { crypto } from 'nem2-library';
import { KeyPair } from '../model/common/keypair';
export class NemPrivacyStrategy {
  private keypair: KeyPair;

  constructor(key: KeyPair) {
    this.keypair = key;
  }

  public encrypt(message: any): any {
    crypto.encode(this.keypair.privateKey, this.keypair.publicKey, message);

    console.log(this.keypair);
    return message;
  }

  public decrypt(message: any): any {
    console.log(this.keypair);
    crypto.decode(this.keypair.privateKey, this.keypair.publicKey, message);
    return message;
  }
}
