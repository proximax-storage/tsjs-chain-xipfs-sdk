import { Observable, of } from 'rxjs';

export class DigestUtils {
  public static validateDigest(data: any, digest: string): Observable<boolean> {
    console.log(data);
    console.log(digest);
    return of(true);
  }
}
