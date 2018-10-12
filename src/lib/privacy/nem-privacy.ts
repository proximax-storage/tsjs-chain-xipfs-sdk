import { crypto } from '@thomas.tran/nem2-library';
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

  /**
   * Encrypts data
   * @param data the data in
   */
  public encrypt(data: Uint8Array): Uint8Array {
    return crypto.nemencrypt(this.privateKey, this.publicKey, data);
  }

  /**
   * Decrypts data
   * @param data the encrypted data
   */
  public decrypt(data: Uint8Array): Uint8Array {
    return crypto.nemdecrypt(this.privateKey, this.publicKey, data);
  }
}
