import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProximaxUploadResult } from '../model/proximax/upload-result';
import { UploadParameter } from '../model/upload/upload-parameter';
import { TransactionService } from './transaction-service';

export class UploadService {
  private transactionService: TransactionService;

  constructor(transactionService: TransactionService) {
    this.transactionService = transactionService;
  }

  public upload(param: UploadParameter): Observable<ProximaxUploadResult> {
    console.log(param);

    const dataMessage = JSON.stringify(param.dataPayload);
    const securedMessage = dataMessage; // Todo encryption

    return this.transactionService
      .createTransaction(securedMessage, param.keyPair)
      .pipe(
        map(response => {
          return new ProximaxUploadResult(response.message);
        })
      );
  }
}
