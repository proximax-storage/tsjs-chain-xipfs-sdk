import { PrivacyStrategy } from './privacy';
import { PrivacyType } from './privacy-type';

export class PlainPrivacyStrategy implements PrivacyStrategy {
  public getPrivacyType(): number {
    return PrivacyType.PLAIN;
  }

  public encrypt(data: any) {
    return data;
  }

  public decrypt(data: any) {
    return data;
  }
}
