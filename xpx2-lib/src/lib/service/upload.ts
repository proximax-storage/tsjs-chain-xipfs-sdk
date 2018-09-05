import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { IpfsDataInfo } from '../model/proximax/ipfs-data-info';
import { MessagePayloadModel } from '../model/proximax/message-payload-model';
// import { ProximaxUploadParameter } from '../model/proximax/upload-parameter';
// import { ProximaxUploadResult } from '../model/proximax/upload-result';
import { UploadParameter } from '../model/upload/upload-parameter';
import { UploadResult } from '../model/upload/upload-result';
// import { NemPrivacyStrategy } from '../privacy/nem-privacy';
import { DataService } from './data-service';
import { TransactionService } from './transaction-service';

export class UploadService {
  private transactionService: TransactionService;
  private dataService: DataService;

  constructor(
    transactionService: TransactionService,
    dataService: DataService
  ) {
    this.transactionService = transactionService;
    this.dataService = dataService;
  }
  /*
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
  }*/

  public uploadAsync(param: UploadParameter): Observable<any> {
    // data verification
    param.validate();

    const ipfsDataInfo: IpfsDataInfo = {
      contentType: param.data.contentType,
      description: param.data.description,
      metadata: param.data.metadata,
      name: param.data.name
    };

    // TODO encrypt stream with privacy
    return this.dataService
      .createProximaxDataFile(
        param.data.byteStreams,
        param.data.contentType,
        param.privacyStrategy,
        param.data.options
      )
      .pipe(
        switchMap(response => {
          ipfsDataInfo.dataHash = response.dataHash;
          ipfsDataInfo.timestamp = Date.now();
          const messagePayload: MessagePayloadModel = {
            data: ipfsDataInfo,
            privacyType: param.privacyStrategy,
            version: 'version 1.0'
          };

          console.log(messagePayload);

          return this.transactionService
            .announceAsyncTransaction(
              messagePayload,
              param.signerPrivateKey,
              param.recipientPublicKey!,
              param.useBlockhainSecureMessage!
            )
            .pipe(
              map(trxResponse => {
                const uploadResult: UploadResult = new UploadResult(
                  trxResponse,
                  messagePayload.privacyType,
                  messagePayload.version,
                  messagePayload.data
                );
                return uploadResult;
              })
            );
        })
      );
  }
}
