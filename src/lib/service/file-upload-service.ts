import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConnectionConfig } from '../connection/connection-config';
import { FileRepositoryFactory } from './factory/file-repository-factory';
import { FileUploadResponse } from './file-upload-response';
import { FileRepository } from './repository/file-repository';

/**
 * The service class responsible for uploading data/file
 */
export class FileUploadService {
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

  public uploadStream(data: any): Observable<FileUploadResponse> {
    if (data === null || data === undefined) {
      throw new Error('Upload data is required');
    }

    return this.fileRepository.addStream(data).pipe(
      map(hash => {
        return new FileUploadResponse(hash, Date.now());
      })
    );
  }
}
