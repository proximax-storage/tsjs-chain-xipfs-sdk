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
import { ConnectionConfig } from '../connection/connection-config';
import { ProximaxMessagePayloadModel } from '../model/proximax/message-payload-model';
import { BlockchainTransactionService } from '../service/blockchain-transaction-service';
import { CreateProximaxDataService } from '../service/create-proximax-data-service';
import { CreateProximaxMessagePayloadService } from '../service/create-proximax-message-payload-service';
import { UploadParameter } from './upload-parameter';
import { UploadResult } from './upload-result';

/**
 * The Uploader class that handles the upload functionality
 * <br>
 * <br>
 * The Uploader creation requires a ConnectionConfig that defines generally where and how the upload will be done.
 * The instance of the class can be reused to upload multiple times.
 * <br>
 * <br>
 * Each upload requires an UploadParameter that contains what is being uploaded along with additional details.
 */
export class Uploader {
  private readonly blockchainTransactionService: BlockchainTransactionService;
  private readonly createProximaxDataService: CreateProximaxDataService;
  private readonly createProximaxMessagePayloadService: CreateProximaxMessagePayloadService;

  /**
   * Construct the class with a ConnectionConfig
   *
   * @param connectionConfig the connection config that defines generally where the upload will be sent
   */
  public constructor(public readonly connectionConfig: ConnectionConfig) {
    this.blockchainTransactionService = new BlockchainTransactionService(
      connectionConfig.blockchainNetworkConnection
    );
    this.createProximaxDataService = new CreateProximaxDataService(
      connectionConfig
    );
    this.createProximaxMessagePayloadService = new CreateProximaxMessagePayloadService();
  }

  /**
   * Upload a data and attach it on a blockchain transaction.
   * This upload returns result once the blockchain transaction is validated and already set with `unconfirmed` status
   * <br>
   * The upload throws an UploadFailureException runtime exception if does not succeed.
   *
   * @param uploadParam the upload parameter
   * @return the upload result
   */
  public async upload(param: UploadParameter): Promise<UploadResult> {
    return this.doUpload(param);
  }

  private async doUpload(param: UploadParameter): Promise<UploadResult> {
    const uploadData = await this.createProximaxDataService.createData(param);
    const messagePayload = await this.createProximaxMessagePayloadService.createMessagePayload(
      param,
      uploadData
    );
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

  private async createAndAnnounceTransaction(
    param: UploadParameter,
    payload: ProximaxMessagePayloadModel
  ): Promise<string> {
    return this.blockchainTransactionService.createAndAnnounceTransaction(
      payload,
      param.signerPrivateKey,
      param.transactionDeadline,
      param.useBlockchainSecureMessage,
      param.recipientPublicKey,
      param.recipientAddress
    );
  }
}
