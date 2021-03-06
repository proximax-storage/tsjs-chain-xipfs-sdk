import crypto from 'crypto';
import { Transform, TransformCallback } from 'stream';
import { Convert, KeyPair, SignSchema } from 'tsjs-xpx-chain-sdk';
import { NemKeysCipherStreamOptions } from './nem-keys-cipher-stream-options';

export class NemKeysDecipherStream extends Transform {
  private static readonly SaltLength = 32;
  private static readonly IvLength = 16;

  private readonly privateKey: string;
  private readonly publicKey: string;
  private readonly salt: Buffer;
  private readonly iv: Buffer;

  private decipher: crypto.Decipher;
  private saltBytesRead: number;
  private ivBytesRead: number;

  public constructor(public readonly options: NemKeysCipherStreamOptions) {
    super(options);

    this.privateKey = options.privateKey;
    this.publicKey = options.publicKey;
    this.saltBytesRead = 0;
    this.ivBytesRead = 0;
    this.salt = Buffer.alloc(NemKeysDecipherStream.SaltLength);
    this.iv = Buffer.alloc(NemKeysDecipherStream.IvLength);
  }

  public _transform(chunk: any, _: string, callback: TransformCallback): void {
    let chunkLength = chunk.length;
    let chunkOffset = 0;

    if (this.saltBytesRead < NemKeysDecipherStream.SaltLength) {
      const remainingSaltBytes =
        NemKeysDecipherStream.SaltLength - this.saltBytesRead;
      chunkOffset =
        chunkLength <= remainingSaltBytes ? chunkLength : remainingSaltBytes;
      chunk.copy(this.salt, this.saltBytesRead, 0, chunkOffset);
      chunk = chunk.slice(chunkOffset);
      chunkLength = chunk.length;
      this.saltBytesRead += chunkOffset;
    }

    if (this.ivBytesRead < NemKeysDecipherStream.IvLength) {
      const remainingIvBytes =
        NemKeysDecipherStream.IvLength - this.ivBytesRead;
      chunkOffset =
        chunkLength <= remainingIvBytes ? chunkLength : remainingIvBytes;
      chunk.copy(this.iv, this.ivBytesRead, 0, chunkOffset);
      chunk = chunk.slice(chunkOffset);
      chunkLength = chunk.length;
      this.ivBytesRead += chunkOffset;
    }

    if (
      this.saltBytesRead === NemKeysDecipherStream.SaltLength &&
      this.ivBytesRead === NemKeysDecipherStream.IvLength &&
      !this.decipher
    ) {
    
      this.decipher = this.getDecipher(
        this.privateKey,
        this.publicKey,
        this.salt,
        this.iv
      );
    }

    if (this.decipher) {
      this.push(this.decipher.update(chunk));
    }
    callback();
  }

  public _flush(callback: TransformCallback): void {
    try {
      if (this.decipher) {
        this.push(this.decipher.final());
      }
    } catch (e) {
      return callback(e);
    }
    callback();
  }

  private getDecipher(
    privateKey: string,
    publicKey: string,
    salt: Buffer,
    iv: Buffer
  ): crypto.Decipher {
    const keyPair = KeyPair.createKeyPairFromPrivateKeyString(privateKey, SignSchema.SHA3);
    const pk = Convert.hexToUint8(publicKey);
    const key = KeyPair.deriveSharedKey(keyPair, pk, salt, SignSchema.SHA3);

    return crypto.createDecipheriv('aes-256-cbc', key, iv);
  }
}
