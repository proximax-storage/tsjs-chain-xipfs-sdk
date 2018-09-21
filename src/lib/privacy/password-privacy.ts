import { from, Observable } from 'rxjs';

import { Converter } from '../helper/converter';
import { PBECipherEncryptor } from './pbe-cipher-encryptor';
import { PrivacyStrategy } from './privacy';
import { PrivacyType } from './privacy-type';
export class PasswordPrivacyStrategy implements PrivacyStrategy {
  private cipher: any;

  /**
   * Constructor
   * @param password the password
   */
  constructor(password: string) {
    if (password === null || password === undefined) {
      throw new Error('The password is required');
    }

    const isBrowser =
      typeof window !== 'undefined' && typeof window.document !== 'undefined';

    if (isBrowser) {
      this.cipher = new PBECipherEncryptor(Converter.str2ab(password));
    } else {
      throw new Error('The password privacy is not available for nodejs');
    }
  }

  public getPrivacyType(): number {
    return PrivacyType.PASSWORD;
  }

  /**
   * Encrypts raw data
   * @param data the raw data
   * @returns Observable<any>
   */
  public encrypt(data: any): Observable<any> {
    return from(this.cipher.encrypt(data));
  }

  /**
   * Decrypts the encrypted data
   * @param data the encrypted data
   * @returns Observable<any>
   */
  public decrypt(data: any): Observable<any> {
    return from(this.cipher.decrypt(data));
  }
}
