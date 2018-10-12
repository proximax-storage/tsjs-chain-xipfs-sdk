import { SecureMessage, TransferTransaction } from '@thomas.tran/nem2-sdk';

import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ConnectionConfig } from '../connection/connection-config';
import { Converter } from '../helper/converter';
import { ProximaxMessagePayloadModel } from '../model/proximax/message-payload-model';
import { PrivacyStrategy } from '../privacy/privacy';
import { BlockchainTransactionService } from '../service/blockchain-transaction-service';
import { RetrieveProximaxDataService } from '../service/retrieve-proximax-data-service';
import { DownloadParameter } from './download-parameter';
import { DownloadResult } from './download-result';
import { DownloadResultData } from './download-result-data';

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

export class Downloader {
  private blockchainTransactionService: BlockchainTransactionService;
  private retrieveProximaxDataService: RetrieveProximaxDataService;

  constructor(connectionConfig: ConnectionConfig) {
    this.blockchainTransactionService = new BlockchainTransactionService(
      connectionConfig.blockchainNetworkConnection
    );
    this.retrieveProximaxDataService = new RetrieveProximaxDataService(
      connectionConfig
    );
  }

  public download(param: DownloadParameter): Promise<DownloadResult> {
    return this.doDownload(param).toPromise();
  }

  public doDownload(param: DownloadParameter): Observable<DownloadResult> {
    const downloadResult$ = this.blockchainTransactionService
      .getTransferTransaction(param.transactionHash)
      .pipe(
        map(transferedTransaction => {
          return this.getMessagePayload(
            transferedTransaction,
            param.accountPrivateKey!,
            param.accountPublicKey!
          );
        }),
        switchMap(messagePayload => {
          return this.getStream(
            messagePayload.data.dataHash,
            param.privacyStrategy!,
            param.validateDigest!,
            messagePayload.data.digest!,
            messagePayload
          ).pipe(
            map(contents => {
              const bytes = contents[0].content;
              return this.createCompleteDownloadResult(
                messagePayload,
                bytes,
                param.transactionHash
              );
            })
          );
        })
      );

    return downloadResult$;
  }

  public createCompleteDownloadResult(
    messagePayloadModel: ProximaxMessagePayloadModel,
    stream: any,
    transactionhash: string
  ): DownloadResult {
    const data = messagePayloadModel.data;

    return new DownloadResult(
      transactionhash,
      messagePayloadModel.privacyType,
      messagePayloadModel.version,
      new DownloadResultData(
        data.dataHash,
        data.timestamp!,
        stream,
        data.digest,
        data.description,
        data.contentType,
        data.name,
        data.metadata
      )
    );
  }

  /*
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
                    return this.retrieveProximaxDataService
                        .getStream(messagePayloadModel.data!)
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
    }*/

  /**
   * Gets the proximax message payload
   * @param transferTransaction the transfer transaction
   * @param accountPrivateKey the account private key
   */
  public getMessagePayload(
    transferTransaction: TransferTransaction,
    accountPrivateKey: string,
    accountPublicKey: string
  ): ProximaxMessagePayloadModel {
    let messagePayloadModel: ProximaxMessagePayloadModel;
    // console.log('accountPrivateKey ' + accountPrivateKey);
    // console.log('accountPublicKey ' + accountPublicKey);

    const payload = Converter.decodeHex(transferTransaction.message.payload);
    // console.log('transferTransaction ...');
    // console.log(transferTransaction);
    if (transferTransaction.message.type === 2) {
      const payloadDecoded = SecureMessage.decrypt(
        payload,
        accountPublicKey,
        accountPrivateKey
      );
      // console.log('decrypt message');
      // console.log(payloadDecoded);
      messagePayloadModel = JSON.parse(payloadDecoded.payload);
    } else {
      // console.log('plain message ..');
      messagePayloadModel = JSON.parse(payload);
    }

    return messagePayloadModel;
  }

  private getStream(
    dataHash: string,
    privacyStrategy: PrivacyStrategy,
    validateDigest: boolean,
    digest: string,
    messagePayload?: ProximaxMessagePayloadModel
  ) {
    let resolvedDataHash = dataHash;
    let resolvedDigest = digest;
    let resolvedContentType;

    if (messagePayload) {
      resolvedDataHash = messagePayload.data.dataHash;
      resolvedDigest = messagePayload.data.digest!;
      resolvedContentType = messagePayload.data.contentType;
    }

    return this.retrieveProximaxDataService.getStream(
      resolvedDataHash,
      privacyStrategy,
      validateDigest,
      resolvedDigest,
      resolvedContentType
    );
  }
}
