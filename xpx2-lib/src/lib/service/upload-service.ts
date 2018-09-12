import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ProximaxDataModel } from '../model/proximax/data-model';
import { ProximaxMessagePayloadModel } from '../model/proximax/message-payload-model';
import { UploadParameter } from '../model/upload/upload-parameter';
import { UploadResult } from '../model/upload/upload-result';
import { BlockchainTransactionService } from './blockchain-transaction-service';
import { ProximaxDataService } from './proximax-data-service';

export class UploadService {
  private blockchainTransactionService: BlockchainTransactionService;
  private proximaxDataService: ProximaxDataService;

  constructor(
    blockchainTransactionService: BlockchainTransactionService,
    proximaxDataService: ProximaxDataService
  ) {
    this.blockchainTransactionService = blockchainTransactionService;
    this.proximaxDataService = proximaxDataService;
  }

  public upload(param: UploadParameter): Observable<UploadResult> {
    return this.proximaxDataService.createData(param).pipe(
      switchMap(uploadData =>
        this.createMessagePayload(param, uploadData).pipe(
          switchMap(messagePayload =>
            this.createAndAnnounceTransaction(param, messagePayload).pipe(
              map(transactionHash => {
                return new UploadResult(
                  transactionHash,
                  messagePayload.privacyType,
                  messagePayload.version,
                  messagePayload.data
                );
              })
            )
          )
        )
      )
    );
  }

  private createAndAnnounceTransaction(
    param: UploadParameter,
    payload: ProximaxMessagePayloadModel
  ): Observable<string> {
    return this.blockchainTransactionService.createAndAnnounceTransaction(
      payload,
      param.signerPrivateKey,
      param.recipientPublicKey,
      param.recipientAddress,
      param.transactionDeadline,
      param.useBlockhainSecureMessage
    );
  }

  private createMessagePayload(
    param: UploadParameter,
    data: ProximaxDataModel
  ): Observable<ProximaxMessagePayloadModel> {
    const messagePayload = new ProximaxMessagePayloadModel(
      param.privacyStrategy,
      data,
      param.version!
    );
    return of(messagePayload);
  }
}
