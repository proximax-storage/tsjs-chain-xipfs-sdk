import { KeyPair } from '../model/common/keypair';

export class NemPrivacyStrategy {
  private keypair: KeyPair;

  constructor(key: KeyPair) {
    this.keypair = key;
  }

  public encrypt(message: any): any {
    console.log(this.keypair);
    return message;
  }

  public decrypt(message: any): any {
    console.log(this.keypair);
    return message;
  }
}
