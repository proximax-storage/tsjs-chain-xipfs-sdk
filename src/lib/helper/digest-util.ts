import crypto from 'crypto';
import { Stream } from 'stream';

export class DigestUtils {
  public static async validateDigest(
    stream: Stream,
    expectedDigest: string
  ): Promise<boolean> {
    if (!stream) {
      throw new Error('stream is required');
    }

    if (!expectedDigest) {
      return true;
    }

    const computeDigest = await DigestUtils.computeDigest(stream);
    if (computeDigest === expectedDigest) {
      return true;
    } else {
      throw new Error('data digests does not match');
    }
  }

  public static async computeDigest(stream: Stream): Promise<string> {
    const hash = crypto.createHash('sha256');
    return new Promise<string>(resolve => {
      stream.on('data', chunk => hash.update(chunk));
      stream.on('end', () => resolve(hash.digest('hex')));
    });
  }
}
