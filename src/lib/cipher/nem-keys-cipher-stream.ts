import crypto from 'crypto';
import { Transform, TransformCallback } from 'stream';
import { Convert, KeyPair, SignSchema } from 'tsjs-xpx-chain-sdk';
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


  private getCipher(
    privateKey: string,
    publicKey: string,
    salt: Buffer,
    iv: Buffer
  ): crypto.Cipher {
    const keyPair = KeyPair.createKeyPairFromPrivateKeyString(privateKey, SignSchema.SHA3);
    const pk = Convert.hexToUint8(publicKey);
    const key = KeyPair.deriveSharedKey(keyPair, pk, salt, SignSchema.SHA3);

    return crypto.createCipheriv('aes-256-cbc', key, iv);
  }
}
