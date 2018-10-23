import { Stream } from 'stream';
import { PrivacyStrategy } from './privacy';
import { PrivacyType } from './privacy-type';

/**
 * The abstract class to be used when creating custom privacy strategy
 * <br>
 * <br>
 * This fixes the privacy type as CUSTOM
 * @see PrivacyType
 */
export abstract class CustomPrivacyStrategy implements PrivacyStrategy {
  /**
   * Get the privacy type which is set as CUSTOM
   * @return the privacy type's int value
   * @see PrivacyType
   */
  public getPrivacyType(): number {
    return PrivacyType.CUSTOM;
  }

  public abstract decrypt(encryptedStream: Stream): Stream;

  public abstract encrypt(stream: Stream): Stream;
}
