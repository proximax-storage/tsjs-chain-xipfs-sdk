import {PrivacyStrategy} from './privacy';
import {PrivacyType} from './privacy-type';
import {Stream} from "stream";

export class PlainPrivacyStrategy implements PrivacyStrategy {
  public static create(): any {
    return new PlainPrivacyStrategy();
  }

  private constructor() {}

  public getPrivacyType(): number {
    return PrivacyType.PLAIN;
  }

  public encrypt(stream: Stream): Stream {
    return stream;
  }

  public decrypt(encryptedStream: Stream): Stream {
    return encryptedStream;
  }
}
