import { Stream } from 'stream';
import { ConnectionConfig } from '../connection/connection-config';
import { ProximaxMessagePayloadModel } from '../model/proximax/message-payload-model';
import { PrivacyStrategy } from '../privacy/privacy';
import { BlockchainTransactionService } from '../service/blockchain-transaction-service';
import { RetrieveProximaxDataService } from '../service/retrieve-proximax-data-service';
import { RetrieveProximaxMessagePayloadService } from '../service/retrieve-proximax-message-payload-service';
import { DirectDownloadParameter } from './direct-download-parameter';
import { DownloadParameter } from './download-parameter';
import { DownloadResult } from './download-result';
import { DownloadResultData } from './download-result-data';

/**
 * The Downloader class that handles the download functionality
 * <br>
 * <br>
 * The Downloader creation requires a ConnectionConfig that defines generally where the download will be done.
 * The instance of the class can be reused to download multiple times.
 * <br>
 * <br>
 * Downloads can be done by providing the blockchain transaction hash or the data hash.
 * A complete download can be done to get the data and its accompanying details,
 * and a direct download can be done to retrieve the data only.
 */
export class Downloader {
  private blockchainTransactionService: BlockchainTransactionService;
  private retrieveProximaxMessagePayloadService: RetrieveProximaxMessagePayloadService;
  private retrieveProximaxDataService: RetrieveProximaxDataService;

  constructor(connectionConfig: ConnectionConfig) {
    this.blockchainTransactionService = new BlockchainTransactionService(
      connectionConfig.blockchainNetworkConnection
    );
    this.retrieveProximaxDataService = new RetrieveProximaxDataService(
      connectionConfig
    );
    this.retrieveProximaxMessagePayloadService = new RetrieveProximaxMessagePayloadService(
      connectionConfig.blockchainNetworkConnection
    );
  }

  /**
   * Retrieve the data and its accompanying details.
   * This would use the blockchain transaction hash to retrieve the data's byte stream and its details.
   * <br>
   *
   * @param param the download parameter
   * @return the download result
   */
  public async download(param: DownloadParameter): Promise<DownloadResult> {
    if (!param) {
      throw new Error('param is required');
    }
    return this.doDownload(param);
  }

  /**
   * Retrieve the data
   *
   * @param param the direct download data parameter
   * @return the data
   */
  public async directDownload(param: DirectDownloadParameter): Promise<Stream> {
    if (!param) {
      throw new Error('param is required');
    }
    return this.doDirectDownload(param);
  }

  private async doDownload(param: DownloadParameter): Promise<DownloadResult> {
    const messagePayload = await this.getMessagePayload(
      param.transactionHash,
      param.accountPrivateKey
    );
    const getStreamFunction = () =>
      this.getStream(
        param.privacyStrategy,
        param.validateDigest,
        messagePayload.data.dataHash,
        messagePayload.data.digest,
        messagePayload
      );

    return this.createCompleteDownloadResult(
      messagePayload,
      getStreamFunction,
      param.transactionHash
    );
  }

  private async doDirectDownload(
    param: DirectDownloadParameter
  ): Promise<Stream> {
    const messagePayload = param.transactionHash
      ? await this.getMessagePayload(
          param.transactionHash,
          param.accountPrivateKey
        )
      : undefined;
    return this.getStream(
      param.privacyStrategy,
      param.validateDigest,
      param.dataHash,
      param.digest,
      messagePayload
    );
  }

  private async getMessagePayload(
    transactionHash: string,
    accountPrivateKey?: string
  ): Promise<ProximaxMessagePayloadModel> {
    const transferTransaction = await this.blockchainTransactionService
      .getTransferTransaction(transactionHash)
      .toPromise();
    const messagePayload = await this.retrieveProximaxMessagePayloadService.getMessagePayload(
      transferTransaction,
      accountPrivateKey
    );
    return messagePayload;
  }

  private createCompleteDownloadResult(
    messagePayloadModel: ProximaxMessagePayloadModel,
    getStreamFunction: () => Promise<Stream>,
    transactionhash: string
  ): DownloadResult {
    const data = messagePayloadModel.data;

    return new DownloadResult(
      transactionhash,
      messagePayloadModel.privacyType,
      messagePayloadModel.version,
      new DownloadResultData(
        data.dataHash,
        data.timestamp,
        getStreamFunction,
        data.digest,
        data.description,
        data.contentType,
        data.name,
        data.metadata
      )
    );
  }

  private getStream(
    privacyStrategy: PrivacyStrategy,
    validateDigest: boolean,
    dataHash?: string,
    digest?: string,
    messagePayload?: ProximaxMessagePayloadModel
  ): Promise<Stream> {
    const resolvedDataHash = messagePayload
      ? messagePayload.data.dataHash
      : dataHash;
    const resolvedDigest = messagePayload ? messagePayload.data.digest : digest;
    const resolvedContentType =
      messagePayload && messagePayload.data.contentType;

    return this.retrieveProximaxDataService.getStream(
      resolvedDataHash!,
      privacyStrategy,
      validateDigest,
      resolvedDigest,
      resolvedContentType
    );
  }
}
