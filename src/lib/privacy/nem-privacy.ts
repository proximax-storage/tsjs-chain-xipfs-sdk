import { Stream } from 'stream';
import { NemKeysCipherStream } from '../cipher/nem-keys-cipher-stream';
import { NemKeysDecipherStream } from '../cipher/nem-keys-decipher-stream';
import { PrivacyStrategy } from './privacy';
import { PrivacyType } from './privacy-type';

/**
 * The privacy strategy that secures data using the NEM keys (a private key and a public key).
 * This strategy encrypt and decrypt the data using both private and public keys
 */
export class NemPrivacyStrategy implements PrivacyStrategy {
  /**
   * Create instance of this strategy
   * @param privateKey the private key
   * @param publicKey the public key
   * @return the instance of this strategy
   */
  public static create(privateKey: string, publicKey: string) {
    return new NemPrivacyStrategy(privateKey, publicKey);
  }

  protected constructor(
    public readonly privateKey: string,
    public readonly publicKey: string
  ) {
    if (!privateKey) {
      throw new Error('privateKey is required');
    }
    if (!publicKey) {
      throw new Error('publicKey is required');
    }
  }

  /**
   * Get the privacy type which is set as NEMKEYS
   * @return the privacy type's int value
   * @see PrivacyType
   */
  public getPrivacyType(): number {
    return PrivacyType.NEM_KEYS;
  }

  /**
   * Encrypt byte stream using the private and public keys provided
   * @param stream the byte stream to encrypt
   * @return the encrypted byte stream
   */
  public encrypt(stream: Stream): Stream {
    return stream.pipe(
      new NemKeysCipherStream({
        privateKey: this.privateKey,
        publicKey: this.publicKey
      })
    );
  }

  /**
   * Encrypt byte stream using the private and public keys provided
   * @param encryptedStream the byte stream to decrypt
   * @return the decrypted byte stream
   */
  public decrypt(encryptedStream: Stream): Stream {
    return encryptedStream.pipe(
      new NemKeysDecipherStream({
        privateKey: this.privateKey,
        publicKey: this.publicKey
      })
    );
  }
}
