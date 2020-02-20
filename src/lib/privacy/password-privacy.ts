import { Stream } from 'stream';
import { PbeCipherStream } from '../cipher/pbe-cipher-stream';
import { PbeDecipherStream } from '../cipher/pbe-decipher-stream';
import { PrivacyStrategy } from './privacy';
import { PrivacyType } from './privacy-type';

/**
 * The privacy strategy that secures the data using a long password, 50 characters minimum.
 */
export class PasswordPrivacyStrategy implements PrivacyStrategy {
  public static readonly MinPasswordLength = 10;

  /**
   * Create instance of this strategy
   * @param password the password
   * @return the instance of this strategy
   */
  public static create(password: string): PasswordPrivacyStrategy {
    // TODO generate password if none is provided
    return new PasswordPrivacyStrategy(password);
  }

  private constructor(public readonly password: string) {
    if (!password) {
      throw new Error('password is required');
    }
    if (password.length <= 10) {
      throw new Error(
        `'minimum length for password is ${
          PasswordPrivacyStrategy.MinPasswordLength
        }`
      );
    }
  }

  /**
   * Get the privacy type which is set as PASSWORD
   * @return the privacy type's int value
   * @see PrivacyType
   */
  public getPrivacyType(): number {
    return PrivacyType.PASSWORD;
  }

  /**
   * Encrypt byte stream with password
   * @param stream the byte stream to encrypt
   * @return the encrypted byte stream
   */
  public encrypt(stream: Stream): Stream {
    return stream
      .pipe(new PbeCipherStream({ password: this.password }));
  }

  /**
   * Decrypt byte stream with password
   * @param encryptedStream the byte stream to decrypt
   * @return the decrypted byte stream
   */
  public decrypt(encryptedStream: Stream): Stream {
    return encryptedStream
      .pipe(
        new PbeDecipherStream({ password: this.password })
      );
     
  }
}
