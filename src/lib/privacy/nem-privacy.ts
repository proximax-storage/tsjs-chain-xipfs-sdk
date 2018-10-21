import {PrivacyStrategy} from './privacy';
import {PrivacyType} from './privacy-type';
import {Stream} from "stream";
import {NemKeysCipherStream} from "../cipher/nem-keys-cipher-stream";
import {NemKeysDecipherStream} from "../cipher/nem-keys-decipher-stream";

export class NemPrivacyStrategy implements PrivacyStrategy {
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

  public getPrivacyType(): number {
    return PrivacyType.NEM_KEYS;
  }

  /**
   * Encrypts raw stream
   * @param encryptedStream the raw stream
   * @returns encrypted stream with nem keys
   */
  public encrypt(stream: Stream): Stream {
    return stream.pipe(new NemKeysCipherStream({privateKey: this.privateKey, publicKey: this.publicKey}));
  }

  /**
   * Decrypts the encrypted data
   * @param stream the encrypted stream
   * @returns decrypted with ney keys stream
   */
  public decrypt(encryptedStream: Stream): Stream {
    return encryptedStream.pipe(new NemKeysDecipherStream({privateKey: this.privateKey, publicKey: this.publicKey}));
  }
}
