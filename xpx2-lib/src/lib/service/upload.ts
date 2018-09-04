import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProximaxUploadParameter } from '../model/proximax/upload-parameter';
import { ProximaxUploadResult } from '../model/proximax/upload-result';
import { UploadParameter } from '../model/upload/upload-parameter';
import { NemPrivacyStrategy } from '../privacy/nem-privacy';
import { DataService } from './data-service';
import { TransactionService } from './transaction-service';

export class UploadService {
  private transactionService: TransactionService;
  private dataService:DataService;

  constructor(transactionService: TransactionService, dataService: DataService) {
    this.transactionService = transactionService;
    this.dataService = dataService;
  }

  public upload(
    param: ProximaxUploadParameter
  ): Observable<ProximaxUploadResult> {
    console.log(param);

    const dataMessage = JSON.stringify(param.dataPayload);

    const nemPrivacyStrategy = new NemPrivacyStrategy(param.keyPair);

    const securedMessage = nemPrivacyStrategy.encrypt(dataMessage);

    return this.transactionService
      .createAsyncTransaction(securedMessage, param.keyPair)
      .pipe(
        map(result => {
          return new ProximaxUploadResult(
            result,
            param.secureType,
            param.version,
            param.dataPayload
          );
        })
      );
  }

  public uploadAsync(param: UploadParameter): any {

    // data verification
    param.validate();

    // TODO encrypt stream with privacy
    this.dataService.createProximaxDataFile
  }
}
