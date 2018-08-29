import { Observable, of } from 'rxjs';
import { ProximaxUploadResult } from '../model/proximax/upload-result';
import { UploadParameter } from '../model/upload/upload-parameter';

export class UploadService {
  public upload(param: UploadParameter): Observable<ProximaxUploadResult> {
    console.log(param);

    const result = new ProximaxUploadResult('');

    return of(result);
  }
}
