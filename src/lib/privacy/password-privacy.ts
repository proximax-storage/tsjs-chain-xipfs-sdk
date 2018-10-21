import {PrivacyStrategy} from './privacy';
import {PrivacyType} from './privacy-type';
import {Stream} from "stream";
import {PbeCipherStream} from "../cipher/pbe-cipher-stream";
import {PBEDecipherStream} from "../cipher/pbe-decipher-stream";

export class PasswordPrivacyStrategy implements PrivacyStrategy {
  public static readonly MinPasswordLength = 10;

  public static create(password: string): PasswordPrivacyStrategy {
    return new PasswordPrivacyStrategy(password);
  }

  /**
   * Constructor
   * @param password the password
   */
  private constructor(public readonly password: string) {
    if (!password) {
      throw new Error('password is required');
    }
    if (password.length <= 10) {
      throw new Error(`'minimum length for password is ${PasswordPrivacyStrategy.MinPasswordLength}`);
    }
  }

  public getPrivacyType(): number {
    return PrivacyType.PASSWORD;
  }

  /**
   * Encrypts raw stream
   * @param encryptedStream the raw stream
   * @returns encrypted stream with password
   */
  public encrypt(stream: Stream): Stream {
    return stream.pipe(new PbeCipherStream({password: this.password}));
  }

  /**
   * Decrypts the encrypted data
   * @param stream the encrypted stream
   * @returns decrypted with password stream
   */
  public decrypt(encryptedStream: Stream): Stream {
    return encryptedStream.pipe(new PBEDecipherStream({password: this.password}));
  }
}
