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
import { ConnectionConfig } from '../connection/connection-config';
import { ProximaxDataModel } from '../model/proximax/data-model';
import { ProximaxMessagePayloadModel } from '../model/proximax/message-payload-model';
import { BlockchainTransactionService } from '../service/blockchain-transaction-service';
import { CreateProximaxDataService } from '../service/create-proximax-data-service';
import { UploadParameter } from './upload-parameter';
import { UploadResult } from './upload-result';

/**
 * Class represents upload service
 */
export class Uploader {
  private blockchainTransactionService: BlockchainTransactionService;
  private createProximaxDataService: CreateProximaxDataService;

  /**
   * Constructor
   * @param blockchainTransactionService the blockchain transaction service
   * @param proximaxDataService the proximax data service
   */
  constructor(connectionConfig: ConnectionConfig) {
    this.blockchainTransactionService = new BlockchainTransactionService(
      connectionConfig.blockchainNetworkConnection
    );
    this.createProximaxDataService = new CreateProximaxDataService(
      connectionConfig
    );
  }

  /**
   * Upload data to Proximax platform
   * @param param the upload parameter
   */
  public async upload(param: UploadParameter): Promise<UploadResult> {
    return this.doUpload(param);
  }

  /**
   * Uploads data to Proximax platform
   * @param param the upload parameter
   */
  private async doUpload(param: UploadParameter): Promise<UploadResult> {
    // console.log(param);
    // throw new Error('Not yet implement');
    const uploadData = await this.createProximaxDataService
      .createData(param)
      .toPromise();
    const messagePayload = await this.createMessagePayload(
      param,
      uploadData
    ).toPromise();
    const transactionHash = await this.createAndAnnounceTransaction(
      param,
      messagePayload
    );

    return UploadResult.create(
      transactionHash,
      messagePayload.privacyType,
      messagePayload.version,
      messagePayload.data
    );
  }

  /**
   * Creates and announce message payload to blockchain
   * @param param the upload parameter
   * @param payload the proximax message payload model
   */
  private async createAndAnnounceTransaction(
    param: UploadParameter,
    payload: ProximaxMessagePayloadModel
  ): Promise<string> {
    return this.blockchainTransactionService.createAndAnnounceTransaction(
      payload,
      param.signerPrivateKey,
      param.recipientPublicKey!,
      param.recipientAddress!,
      param.transactionDeadline!,
      param.useBlockchainSecureMessage!
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
      param.privacyStrategy.getPrivacyType(),
      data,
      param.version
    );
    return of(messagePayload);
  }
}
