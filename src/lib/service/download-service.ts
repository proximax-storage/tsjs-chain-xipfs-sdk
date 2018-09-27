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
import { TransferTransaction } from 'nem2-sdk';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { DownloadParameter } from '../download/download-parameter';
import { DownloadResult } from '../download/download-result';
import { ProximaxMessagePayloadModel } from '../model/proximax/message-payload-model';
import { BlockchainTransactionService } from './blockchain-transaction-service';
import { ProximaxDataService } from './proximax-data-service';

/**
 * Class represents download service
 */
export class DownloadService {
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
   * Downloads the data from Proximax storage
   * @param param the download parameter
   */
  public download(param: DownloadParameter): Observable<DownloadResult> {
    return this.blockchainTransactionService
      .getTransferTransaction(param.transactionHash)
      .pipe(
        map(transferedTransaction =>
          this.getMessagePayload(
            transferedTransaction,
            param.accountPrivateKey!
          )
        ),
        switchMap(messagePayloadModel => {
          // console.log(messagePayloadModel);
          return this.proximaxDataService
            .getData(messagePayloadModel.data!)
            .pipe(
              map(data => {
                // console.log(data);
                return new DownloadResult(
                  param.transactionHash,
                  messagePayloadModel.privacyType,
                  messagePayloadModel.version!,
                  data
                );
              })
            );
        })
      );
  }

  /**
   * Gets the proximax message payload
   * @param transferTransaction the transfer transaction
   * @param accountPrivateKey the account private key
   */
  private getMessagePayload(
    transferTransaction: TransferTransaction,
    accountPrivateKey: string
  ): ProximaxMessagePayloadModel {
    // TODO: handle secure message
    console.log(accountPrivateKey);
    const payload = transferTransaction.message.payload;
    const messagePayloadModel: ProximaxMessagePayloadModel = JSON.parse(
      payload
    );

    return messagePayloadModel;
  }
}
