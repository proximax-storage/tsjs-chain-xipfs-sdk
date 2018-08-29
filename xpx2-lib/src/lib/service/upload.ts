import { Observable, of } from 'rxjs';
import { ProximaxMessagePayloadModel } from '../model/proximax/message-payload';
import { ProximaxUploadResult } from '../model/proximax/upload-result';

export class UploadService {
  public upload(
    payload: ProximaxMessagePayloadModel,
    rootData: ProximaxMessagePayloadModel
  ): Observable<ProximaxUploadResult> {
    console.log(payload);

    const result = new ProximaxUploadResult('', '', '', rootData);

    return of(result);
  }
}
