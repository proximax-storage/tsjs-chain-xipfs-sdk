import request from 'request';
import { PassThrough, Readable, Stream } from 'stream';

export class StreamHelper {
  public static string2Stream(text: string, encoding?: string): PassThrough {
    const stream = new PassThrough();
    stream.write(Buffer.from(text, encoding || 'utf8'));
    stream.end();
    return stream;
  }

  public static async stream2String(
    stream: Stream,
    encoding?: string
  ): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const chunks: Buffer[] = [];
      stream.on('data', chunk => chunks.push(chunk));
      stream.on('error', err => reject(err));
      stream.on('end', () =>
        resolve(Buffer.concat(chunks).toString(encoding || 'utf8'))
      );
    });
  }

  public static buffer2Stream(buffer: Buffer): PassThrough {
    const stream = new PassThrough();
    stream.write(buffer);
    stream.end();
    return stream;
  }

  public static async stream2Buffer(stream: Stream): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
      const chunks: Buffer[] = [];
      stream.on('data', chunk => chunks.push(chunk));
      stream.on('error', err => reject(err));
      stream.on('end', () => resolve(Buffer.concat(chunks)));
    });
  }

  public static async urlReadableStream(url: string): Promise<Readable> {
    return new Promise<Readable>((resolve, reject) => {
      request
        .get(url)
        .on('response', stream => resolve(stream))
        .on('error', err => reject(err));
    });
  }
}
