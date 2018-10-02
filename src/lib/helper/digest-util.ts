import { Observable, of } from 'rxjs';

export class DigestUtils {
  public static validateDigest(data: any, digest: string): Observable<boolean> {
    console.log(data);
    console.log(digest);
    return of(true);
  }

  public static computeDigest(data: any): string {
    const CryptoJS = require('crypto-js');
    const hashDigest = CryptoJS.SHA256(data);
    return hashDigest.toString(CryptoJS.enc.Hex);
  }
}
