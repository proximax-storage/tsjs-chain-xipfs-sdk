import { crypto } from 'nem2-library';
export class NemPrivacyStrategy {
  constructor(
    public readonly privateKey: string,
    public readonly publicKey: string
  ) {}

  public encrypt(message: any): any {
    crypto.encode(this.privateKey, this.publicKey, message);
    return message;
  }

  public decrypt(message: any): any {
    crypto.decode(this.privateKey, this.publicKey, message);
    return message;
  }
}
