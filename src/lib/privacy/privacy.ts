import {Stream} from "stream";

export abstract class PrivacyStrategy {
  public abstract getPrivacyType(): number;
  public abstract encrypt(stream: Stream): Stream;
  public abstract decrypt(encryptedStream: Stream): Stream;
}
