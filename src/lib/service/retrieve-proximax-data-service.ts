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
    digest: string,
    contentType: string
  ): Promise<Stream> {
    if (datahash === null) {
      throw new Error('dataHash is required');
    }
    if (privacyStrategy === null) {
      throw new Error('privacy strategy is required');
    }

    if (contentType != null && contentType === PathUploadContentType) {
      // path
      throw new Error('download of path is not yet supported');
    } else {
      // stream
      await this.validateDigest(validateDigest, digest, datahash);
      return this.fileRepository.getStream(datahash).toPromise();
    }
  }

  private async validateDigest(
    validateDigest: boolean,
    digest: string,
    datahash: string
  ): Promise<boolean> {
    if (validateDigest && digest) {
      const stream = await this.fileRepository.getStream(datahash).toPromise();
      return DigestUtils.validateDigest(stream, digest);
    } else {
      return false;
    }
  }
}
