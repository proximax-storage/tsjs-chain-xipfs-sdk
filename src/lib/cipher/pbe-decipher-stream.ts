import crypto from 'crypto';
import { Transform, TransformCallback } from 'stream';
import { PbeCipherStreamOptions } from './pbe-cipher-stream-options';

export class PBEDecipherStream extends Transform {
  private static readonly SaltLength = 32;
  private static readonly IvLength = 16;

  private readonly password: string;
  private readonly salt: Buffer;
  private readonly iv: Buffer;

  private decipher: crypto.Decipher;
  private saltBytesRead: number;
  private ivBytesRead: number;

  public constructor(public readonly options: PbeCipherStreamOptions) {
    super(options);

    this.password = options.password;
    this.saltBytesRead = 0;
    this.ivBytesRead = 0;
    this.salt = new Buffer(PBEDecipherStream.SaltLength);
    this.iv = new Buffer(PBEDecipherStream.IvLength);
  }

  public _transform(chunk: any, _: string, callback: TransformCallback): void {
    let chunkLength = chunk.length;
    let chunkOffset = 0;

    if (this.saltBytesRead < PBEDecipherStream.SaltLength) {
      const remainingSaltBytes =
        PBEDecipherStream.SaltLength - this.saltBytesRead;
      chunkOffset =
        chunkLength <= remainingSaltBytes ? chunkLength : remainingSaltBytes;
      chunk.copy(this.salt, this.saltBytesRead, 0, chunkOffset);
      chunk = chunk.slice(chunkOffset);
      chunkLength = chunk.length;
      this.saltBytesRead += chunkOffset;
    }

    if (this.ivBytesRead < PBEDecipherStream.IvLength) {
      const remainingIvBytes = PBEDecipherStream.IvLength - this.ivBytesRead;
      chunkOffset =
        chunkLength <= remainingIvBytes ? chunkLength : remainingIvBytes;
      chunk.copy(this.iv, this.ivBytesRead, 0, chunkOffset);
      chunk = chunk.slice(chunkOffset);
      chunkLength = chunk.length;
      this.ivBytesRead += chunkOffset;
    }

    if (
      this.saltBytesRead === PBEDecipherStream.SaltLength &&
      this.ivBytesRead === PBEDecipherStream.IvLength
    ) {
      const key = crypto.pbkdf2Sync(
        this.password,
        this.salt,
        65536,
        256 / 8,
        'sha256'
      );
      this.decipher = crypto.createDecipheriv('aes-256-cbc', key, this.iv);
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
}
