import { PrivacyStrategy } from './privacy';
import { PrivacyType } from './privacy-type';

export class PlainPrivacyStrategy implements PrivacyStrategy {
  public static create(): any {
    return new PlainPrivacyStrategy();
  }

  private constructor() {}

  public getPrivacyType(): number {
    return PrivacyType.PLAIN;
  }

  public encrypt(data: any): any {
    return data;
  }

  public decrypt(data: any): any {
    return data;
  }
}
