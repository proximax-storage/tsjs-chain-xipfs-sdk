// import { crypto } from 'nem2-library';

import * as utf8 from 'utf8';

export class CryptoHelper {
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
