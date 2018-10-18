import { ConnectionConfig } from '../connection/connection-config';
import { ProximaxMessagePayloadModel } from '../model/proximax/message-payload-model';
import { PrivacyStrategy } from '../privacy/privacy';
import { BlockchainTransactionService } from '../service/blockchain-transaction-service';
import { RetrieveProximaxDataService } from '../service/retrieve-proximax-data-service';
import { RetrieveProximaxMessagePayloadService } from '../service/retrieve-proximax-message-payload-service';
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
   * Retrieve synchronously the data and its accompanying details.
   * This would use the blockchain transaction hash to retrieve the data's byte stream and its details.
   * <br>
   *
   * @param downloadParam the download parameter
   * @return the download result
   */
  public async download(param: DownloadParameter): Promise<DownloadResult> {
    return this.doDownload(param);
  }

  private async doDownload(param: DownloadParameter): Promise<DownloadResult> {
    const transferTransaction = await this.blockchainTransactionService
      .getTransferTransaction(param.transactionHash)
      .toPromise();
    const messagePayload = await this.retrieveProximaxMessagePayloadService.getMessagePayload(
      transferTransaction,
      param.accountPrivateKey
    );
    const contents = await this.getStream(
      messagePayload.data.dataHash,
      param.privacyStrategy!,
      param.validateDigest!,
      messagePayload.data.digest!,
      messagePayload
    ).toPromise();

    return this.createCompleteDownloadResult(
      messagePayload,
      contents,
      param.transactionHash
    );
  }

  private createCompleteDownloadResult(
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
