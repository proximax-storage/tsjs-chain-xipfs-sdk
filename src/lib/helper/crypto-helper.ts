// import { crypto } from 'nem2-library';
import * as nemSDK from 'nem-sdk';

import * as utf8 from 'utf8';

export class CryptoHelper {
  public static encode(message: string, privateKey: string, publicKey: string) {
    // console.log(privateKey);
    // console.log(publicKey);
    return nemSDK.default.crypto.helpers.encode(privateKey, publicKey, message);
    // return crypto.encode();
  }

  public static decode(message: string, privateKey: string, publicKey: string) {
    console.log(message);
    const code = CryptoHelper.decodeHex(
      nemSDK.default.crypto.helpers.decode(privateKey, publicKey, message)
    );

    return code;
  }

  public static decodeHex(hex: string): string {
    let str = '';
    for (let i = 0; i < hex.length; i += 2) {
      str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    }
    try {
      return utf8.decode(str);
    } catch (e) {
      return str;
    }
  }
}
