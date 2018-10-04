import { Observable, of } from 'rxjs';

export class DigestUtils {
  public static validateDigest(
    data: any,
    expectedDigest: string
  ): Observable<boolean> {
    if (data === null || data === undefined) {
      throw new Error('Data is required');
    }

    if (expectedDigest === null || expectedDigest.length <= 0) {
      return of(true);
    }

    const computeDigest = DigestUtils.computeDigest(data);
    // console.log('c ' + computeDigest);
    // console.log('e ' + expectedDigest);
    if (computeDigest === expectedDigest) {
      return of(true);
    } else {
      throw new Error('Data digest did not match');
    }

    // return of(true);
  }

  public static computeDigest(data: any): string {
    const CryptoJS = require('crypto-js');
    const wordArray = CryptoJS.lib.WordArray.create(data);
    const hashDigest = CryptoJS.SHA256(wordArray);

    return hashDigest.toString(CryptoJS.enc.Hex);
  }
}
