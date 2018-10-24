import crypto from 'crypto';
import { convert, nacl_catapult, sha3Hasher } from 'proximax-nem2-library';
import { Transform, TransformCallback } from 'stream';
import { NemKeysCipherStreamOptions } from './nem-keys-cipher-stream-options';

export class NemKeysCipherStream extends Transform {
  private cipher: crypto.Cipher;

  public constructor(public readonly options: NemKeysCipherStreamOptions) {
    super(options);

    const salt = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);

    this.cipher = this.getCipher(
      options.privateKey,
      options.publicKey,
      salt,
      iv
    );

    this.push(salt);
    this.push(iv);
  }

  public _transform(chunk: any, _: string, callback: TransformCallback): void {
    this.push(this.cipher.update(chunk));
    callback();
  }

  public _flush(callback: TransformCallback): void {
    this.push(this.cipher.final());
    callback();
  }

  private hashFunction(dest: Uint8Array, data: Uint8Array): void {
    const sha3 = sha3Hasher.createHasher(64);
    sha3.reset();
    sha3.update(data);
    sha3.finalize(dest);
  }

  private getCipher(
    privateKey: string,
    publicKey: string,
    salt: Buffer,
    iv: Buffer
  ): crypto.Cipher {
    const privateKeyUint8Arr = convert.hexToUint8(privateKey);
    const publicKeyUint8Arr = convert.hexToUint8(publicKey);
    const sharedKey = new Uint8Array(32);
    (nacl_catapult as any).lowlevel.crypto_shared_key_hash(
      sharedKey,
      publicKeyUint8Arr,
      privateKeyUint8Arr,
      this.hashFunction
    );

    for (let i = 0; i < salt.length; i++) {
      sharedKey[i] ^= salt[i];
    }

    const key = new Uint8Array(32);
    const sha3 = sha3Hasher.createHasher(32);
    sha3.reset();
    sha3.update(sharedKey);
    sha3.finalize(key);

    return crypto.createCipheriv('aes-256-cbc', key, iv);
  }
}
