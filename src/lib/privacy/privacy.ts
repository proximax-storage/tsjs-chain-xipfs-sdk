import { Stream } from 'stream';

/**
 * The abstract class privacy strategy
 * <br>
 * <br>
 * Privacy strategy handles the encrypting and decrypting of data
 * <br>
 * <br>
 * When creating a custom Privacy Strategy, implement CustomPrivacyStrategy
 */
export abstract class PrivacyStrategy {
  /**
   * Get the privacy type's int value
   * @return the privacy type's int value
   */
  public abstract getPrivacyType(): number;

  /**
   * Encrypt byte stream
   * @param stream the byte stream to encrypt
   * @return encrypted byte stream
   */
  public abstract encrypt(stream: Stream): Stream;

  /**
   * Encrypt byte stream
   * @param encryptedStream the byte stream to decrypt
   * @return the decrypted data
   */
  public abstract decrypt(encryptedStream: Stream): Stream;
}
