/*
 * Copyright 2018 ProximaX Limited
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ProximaxDataModel } from '../model/proximax/data-model';
import { ProximaxMessagePayloadModel } from '../model/proximax/message-payload-model';
import { UploadParameter } from '../model/upload/upload-parameter';
import { UploadResult } from '../model/upload/upload-result';
import { BlockchainTransactionService } from './blockchain-transaction-service';
import { ProximaxDataService } from './proximax-data-service';

/**
 * Class represents upload service
 */
export class UploadService {
  private blockchainTransactionService: BlockchainTransactionService;
  private proximaxDataService: ProximaxDataService;

  /**
   * Constructor
   * @param blockchainTransactionService the blockchain transaction service
   * @param proximaxDataService the proximax data service
   */
  constructor(
    blockchainTransactionService: BlockchainTransactionService,
    proximaxDataService: ProximaxDataService
  ) {
    this.blockchainTransactionService = blockchainTransactionService;
    this.proximaxDataService = proximaxDataService;
  }

  /**
   * Uploads data to Proximax platform
   * @param param the upload parameter
   */
  public upload(param: UploadParameter): Observable<UploadResult> {
    return this.proximaxDataService.addData(param).pipe(
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

  /**
   * Creates and announce message payload to blockchain
   * @param param the upload parameter
   * @param payload the proximax message payload model
   */
  private createAndAnnounceTransaction(
    param: UploadParameter,
    payload: ProximaxMessagePayloadModel
  ): Observable<string> {
    return this.blockchainTransactionService.createAndAnnounceTransaction(
      payload,
      param.signerPrivateKey,
      param.recipientPublicKey!,
      param.recipientAddress!,
      param.transactionDeadline!,
      param.useBlockhainSecureMessage!
    );
  }

  /**
   * Creates the message payload
   * @param param the upload parameter
   * @param data the proximax data model
   */
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
