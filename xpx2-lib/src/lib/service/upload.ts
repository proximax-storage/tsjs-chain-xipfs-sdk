import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProximaxUploadParameter } from '../model/proximax/upload-parameter';
import { ProximaxUploadResult } from '../model/proximax/upload-result';
import { NemPrivacyStrategy } from '../privacy/nem-privacy';
import { TransactionService } from './transaction-service';

export class UploadService {
  private transactionService: TransactionService;

  constructor(transactionService: TransactionService) {
    this.transactionService = transactionService;
  }

  public upload(
    param: ProximaxUploadParameter
  ): Observable<ProximaxUploadResult> {
    console.log(param);

    const dataMessage = JSON.stringify(param.dataPayload);

    const nemPrivacyStrategy = new NemPrivacyStrategy(param.keyPair);
    const securedMessage = nemPrivacyStrategy.encrypt(dataMessage);

    return this.transactionService
      .createTransaction(securedMessage, param.keyPair)
      .pipe(
        map(response => {
          console.log(response);
          return new ProximaxUploadResult('');
        })
      );
  }
}
