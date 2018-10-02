import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConnectionConfig } from '../connection/connection-config';
import { FileRepositoryFactory } from './factory/file-repository-factory';
import { FileUploadResponse } from './file-upload-response';
import { FileRepository } from './repository/file-repository';

export class FileUploadService {
  private fileRepository: FileRepository;

  constructor(connectionConfig: ConnectionConfig) {
    this.fileRepository = FileRepositoryFactory.createFromConnectionConfig(
      connectionConfig
    );
  }

  public uploadStream(
    data: any,
    options?: object
  ): Observable<FileUploadResponse> {
    if (data === null || data === undefined) {
      throw new Error('Upload data is required');
    }

    return this.fileRepository.addStream(data, options).pipe(
      map(hash => {
        return new FileUploadResponse(hash, Date.now());
      })
    );
  }
}
