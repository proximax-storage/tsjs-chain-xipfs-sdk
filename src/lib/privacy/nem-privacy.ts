import { from, Observable } from 'rxjs';
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

  public encrypt(data: any): Observable<any> {
    console.log('Encrypting' + this.privateKey + ' ' + this.publicKey);

    return from(crypto.nemEncrypt(this.privateKey, this.publicKey, data));
    // return from(crypto.nemEncrypt(this.privateKey, this.publicKey, data));

    // return message;
  }

  public decrypt(data: any): Observable<any> {
    console.log('Decrypting');
    return from(crypto.nemDecrypt(this.privateKey, this.publicKey, data));
    // return message;
  }
}
