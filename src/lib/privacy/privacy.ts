export abstract class PrivacyStrategy {
  public abstract getPrivacyType(): number;
  public abstract encrypt(data: any): any;
  public abstract decrypt(data: any): any;
}
