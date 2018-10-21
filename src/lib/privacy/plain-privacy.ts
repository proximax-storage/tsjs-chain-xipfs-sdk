import { Stream } from 'stream';
import { PrivacyStrategy } from './privacy';
import { PrivacyType } from './privacy-type';

/**
 * The plain privacy strategy.
 * <br>
 * <br>
 * This strategy does not encrypt nor decrypt the data.
 */
export class PlainPrivacyStrategy implements PrivacyStrategy {
  /**
   * Create instance of this strategy
   * @return the instance of this strategy
   */
  public static create(): any {
    return new PlainPrivacyStrategy();
  }

  private constructor() {}

  /**
   * Get the privacy type which is set as PLAIN
   * @return the privacy type's int value
   * @see PrivacyType
   */
  public getPrivacyType(): number {
    return PrivacyType.PLAIN;
  }

  /**
   * Return same byte stream
   * @param stream the byte stream to encrypt
   * @return same byte stream
   */
  public encrypt(stream: Stream): Stream {
    return stream;
  }

  /**
   * Return same byte stream
   * @param encryptedStream the byte stream to decrypt
   * @return same byte stream
   */
  public decrypt(encryptedStream: Stream): Stream {
    return encryptedStream;
  }
}
