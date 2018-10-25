import { map } from 'rxjs/operators';
import { Stream } from 'stream';
import { PlainPrivacyStrategy } from '../..';
import { FileStorageConnection } from '../connection/file-storage-connection';
import { DigestUtils } from '../helper/digest-util';
import { PrivacyStrategy } from '../privacy/privacy';
import { FileRepositoryFactory } from './factory/file-repository-factory';
import { FileRepository } from './repository/file-repository';

/**
 * The service class responsible for retrieving data
 */
export class FileDownloadService {
  private readonly fileRepository: FileRepository;

  /**
   * Construct this class
   *
   * @param fileStorageConnection the connection to file storage
   */
  constructor(public readonly fileStorageConnection: FileStorageConnection) {
    this.fileRepository = FileRepositoryFactory.create(fileStorageConnection);
  }

  /**
   * Retrieve byte stream
   *
   * @param dataHash        the data hash of the target download
   * @param privacyStrategy the privacy strategy to decrypt the data
   * @param digest          the digest of the target download
   * @return the byte stream
   */
  public async getStream(
    dataHash: string,
    privacyStrategy?: PrivacyStrategy,
    digest?: string
  ): Promise<Stream> {
    if (!dataHash) {
      throw new Error('dataHash is required');
    }

    const privateStrategyToUse =
      privacyStrategy || PlainPrivacyStrategy.create();

    await this.validateDigest(dataHash, digest);
    return this.fileRepository
      .getStream(dataHash)
      .pipe(
        map(encryptedStream => privateStrategyToUse.decrypt(encryptedStream))
      )
      .toPromise();
  }

  private async validateDigest(
    datahash: string,
    digest?: string
  ): Promise<boolean> {
    if (digest) {
      const stream = await this.fileRepository.getStream(datahash).toPromise();
      return DigestUtils.validateDigest(stream, digest);
    } else {
      return false;
    }
  }
}
