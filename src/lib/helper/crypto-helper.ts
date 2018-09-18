import { crypto } from 'nem2-library';

export class CryptoHelper {
  public static encode(message: string, privateKey: string, publicKey: string) {
    // console.log(privateKey);
    // console.log(publicKey);
    return crypto.encode(privateKey, publicKey, message);
  }

  public static decode(message: string, privateKey: string, publicKey: string) {
    /// console.log(privateKey);
    return crypto.decode(privateKey, publicKey, message);
  }
}
