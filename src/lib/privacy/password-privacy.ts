import { from, Observable } from 'rxjs';
import { TextEncoder } from 'text-encoding-utf-8';
import { PBECipherEncryptor } from './pbe-cipher-encryptor';
import { PrivacyStrategy } from './privacy';
import { PrivacyType } from './privacy-type';
export class PasswordPrivacyStrategy implements PrivacyStrategy {
  private cipher: PBECipherEncryptor;

  /**
   * Constructor
   * @param password the password
   */
  constructor(password: string) {
    if (password === null || password === undefined) {
      throw new Error('The password is required');
    }

    this.cipher = new PBECipherEncryptor(new TextEncoder().encode(password));
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
