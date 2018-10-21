import crypto from 'crypto';
import { Transform, TransformCallback } from 'stream';
import { PbeCipherStreamOptions } from './pbe-cipher-stream-options';

export class PbeCipherStream extends Transform {
  private static readonly SaltLength = 32;
  private static readonly IvLength = 16;

  private cipher: crypto.Cipher;

  public constructor(public readonly options: PbeCipherStreamOptions) {
    super(options);

    const salt = crypto.randomBytes(PbeCipherStream.SaltLength);
    const iv = crypto.randomBytes(PbeCipherStream.IvLength);

    const key = crypto.pbkdf2Sync(
      options.password,
      salt,
      65536,
      256 / 8,
      'sha256'
    );
    this.cipher = crypto.createCipheriv('aes-256-cbc', key, iv);

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
}
