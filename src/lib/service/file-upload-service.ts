import { map } from 'rxjs/operators';
import { Stream } from 'stream';

import { DigestUtils } from '../helper/digest-util';
import { PlainPrivacyStrategy } from '../privacy/plain-privacy';
import { PrivacyStrategy } from '../privacy/privacy';
import { FileUploadResponse } from './file-upload-response';
import { FileRepository } from './repository/file-repository';

/**
 * The service class responsible for uploading data/file
 */
export class FileUploadService {
  /**
   * Construct this class
   *
   * @param fileRepository the file repository
   */
  constructor(public readonly fileRepository: FileRepository) {}

  /**
   * Upload byte stream
   *
   * @param streamFunction the stream function to upload
   * @param privacyStrategy the privacy strategy
   * @param computeDigest the compute digest
   * @return the IPFS upload response
   */
  public async uploadStream(
    streamFunction: () => Promise<Stream>,
    computeDigest?: boolean,
    privacyStrategy?: PrivacyStrategy
  ): Promise<FileUploadResponse> {
    if (!streamFunction) {
      throw new Error('streamFunction is required');
    }

    const computeDigestToUse = computeDigest || false;
    const privateStrategyToUse =
      privacyStrategy || PlainPrivacyStrategy.create();

    const digest = await this.computeDigest(
      streamFunction,
      computeDigestToUse,
      privateStrategyToUse
    );

    return this.fileRepository
      .addStream(privateStrategyToUse.encrypt(await streamFunction()))
      .pipe(
        map(hash => {
          return new FileUploadResponse(hash, Date.now(), digest);
        })
      )
      .toPromise();
  }

  private async computeDigest(
    streamFunction: () => Promise<Stream>,
    computeDigest: boolean,
    privacyStrategy: PrivacyStrategy
  ): Promise<string | undefined> {
    return computeDigest
      ? DigestUtils.computeDigest(
          privacyStrategy.encrypt(await streamFunction())
        )
      : undefined;
  }
}
