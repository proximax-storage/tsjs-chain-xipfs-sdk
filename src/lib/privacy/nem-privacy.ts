import { crypto } from 'xpx2-library';
import { PrivacyStrategy } from './privacy';
import { PrivacyType } from './privacy-type';

export class NemPrivacyStrategy implements PrivacyStrategy {
  private privateKey;
  private publicKey;

  constructor(privateKey: string, publicKey: string) {
    this.privateKey = privateKey;
    this.publicKey = publicKey;
  }

  public getPrivacyType(): number {
    return PrivacyType.NEM_KEYS;
  }

  public encrypt(data: any): any {
    console.log('Encrypting' + this.privateKey + ' ' + this.publicKey);

    return crypto.nemEncrypt(this.privateKey, this.publicKey, data);
    // return from(crypto.nemEncrypt(this.privateKey, this.publicKey, data));

    // return message;
  }

  public decrypt(data: any): any {
    console.log('Decrypting');
    return crypto.nemDecrypt(this.privateKey, this.publicKey, data);
    // return message;
  }
}
