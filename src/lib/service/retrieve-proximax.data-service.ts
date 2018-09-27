import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ConnectionConfig } from '../connection/connection-config';
import { DigestUtils } from '../helper/digest-util';
import { PrivacyStrategy } from '../privacy/privacy';
import { FileRepositoryFactory } from './factory/file-repository-factory';
import { FileRepository } from './repository/file-repository';
export class RetrieveProximaxDataService {
  private fileRepository: FileRepository;

  constructor(connectionConfig: ConnectionConfig) {
    this.fileRepository = FileRepositoryFactory.createFromConnectionConfig(
      connectionConfig
    );
  }

  public getStream(
    datahash: string,
    privacyStrategy: PrivacyStrategy,
    validateDigest: boolean,
    digest: string,
    contentType: string
  ): Observable<any> {
    if (datahash === null) {
      throw new Error('dataHash is required');
    }

    if (privacyStrategy === null) {
      throw new Error('privacy strategy is required');
    }

    console.log(contentType);

    // to be refactor
    return this.fileRepository.getStream(datahash).pipe(
      switchMap(stream => {
        return this.validateDigest(validateDigest, digest, datahash).pipe(
          map(_ => stream)
        );
      })
    );
  }

  private validateDigest(
    validateDigest: boolean,
    digest: string,
    datahash: string
  ): Observable<boolean> {
    return validateDigest
      ? this.fileRepository
          .getStream(datahash)
          .pipe(switchMap(stream => DigestUtils.validateDigest(stream, digest)))
      : of(true);
  }
}
