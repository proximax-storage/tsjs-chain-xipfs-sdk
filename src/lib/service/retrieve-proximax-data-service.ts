import { Stream } from 'stream';
import { PathUploadContentType } from '../config/constants';
import { FileStorageConnection } from '../connection/file-storage-connection';
import { PrivacyStrategy } from '../privacy/privacy';
import { FileDownloadService } from './file-download-service';

/**
 * The service class responsible for retrieving data
 */
export class RetrieveProximaxDataService {
  private readonly fileDownloadService: FileDownloadService;

  /**
   * Construct this class
   *
   * @param fileStorageConnection the connection to file storage
   */
  constructor(public readonly fileStorageConnection: FileStorageConnection) {
    this.fileDownloadService = new FileDownloadService(fileStorageConnection);
  }

  /**
   * Retrieve data's byte stream
   *
   * @param dataHash        the data hash of the target download
   * @param privacyStrategy the privacy strategy to decrypt the data
   * @param validateDigest  the flag whether to validate digest
   * @param digest          the digest of the target download
   * @param contentType     the content type of the target download
   * @return the data's byte stream
   */
  public async getStream(
    dataHash: string,
    privacyStrategy: PrivacyStrategy,
    validateDigest: boolean,
    digest?: string,
    contentType?: string
  ): Promise<Stream> {
    if (!dataHash) {
      throw new Error('dataHash is required');
    }
    if (!privacyStrategy) {
      throw new Error('privacy strategy is required');
    }

    if (!contentType && contentType === PathUploadContentType) {
      // path
      throw new Error('download of path is not yet supported');
    } else {
      // stream
      const digestToUse = validateDigest ? digest : undefined;
      return this.fileDownloadService.getStream(
        dataHash,
        privacyStrategy,
        digestToUse
      );
    }
  }
}
