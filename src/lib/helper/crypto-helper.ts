export class CryptoHelper {
  public static encode(message: string, privateKey: string, publicKey: string) {
    console.log(privateKey);
    console.log(publicKey);
    return message;
  }

  public static decode(message: string, privateKey: string) {
    console.log(privateKey);
    return message;
  }
}
