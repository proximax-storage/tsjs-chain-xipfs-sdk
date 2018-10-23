import { map } from 'rxjs/operators';
import { Stream } from 'stream';
import { PathUploadContentType } from '../config/constants';
import { ConnectionConfig } from '../connection/connection-config';
import { DigestUtils } from '../helper/digest-util';
import { PrivacyStrategy } from '../privacy/privacy';
import { FileRepositoryFactory } from './factory/file-repository-factory';
import { FileRepository } from './repository/file-repository';

/**
 * The service class responsible for retrieving data
 */
export class RetrieveProximaxDataService {
  private readonly fileRepository: FileRepository;

  /**
   * Construct this class
   *
   * @param connectionConfig the connection config
   */
  constructor(public readonly connectionConfig: ConnectionConfig) {
    this.fileRepository = FileRepositoryFactory.createFromConnectionConfig(
      connectionConfig
    );
  }

  public async getStream(
    datahash: string,
    privacyStrategy: PrivacyStrategy,
    validateDigest: boolean,
    digest?: string,
    contentType?: string
  ): Promise<Stream> {
    if (!datahash) {
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
      await this.validateDigest(validateDigest, datahash, digest);
      return this.fileRepository
        .getStream(datahash)
        .pipe(map(encryptedStream => privacyStrategy.decrypt(encryptedStream)))
        .toPromise();
    }
  }

  private async validateDigest(
    validateDigest: boolean,
    datahash: string,
    digest?: string
  ): Promise<boolean> {
    if (validateDigest && digest) {
      const stream = await this.fileRepository.getStream(datahash).toPromise();
      return DigestUtils.validateDigest(stream, digest);
    } else {
      return false;
    }
  }
}
