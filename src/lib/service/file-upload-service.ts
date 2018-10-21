import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {ConnectionConfig} from '../connection/connection-config';
import {FileRepositoryFactory} from './factory/file-repository-factory';
import {FileUploadResponse} from './file-upload-response';
import {FileRepository} from './repository/file-repository';
import {Stream} from "stream";

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

  public uploadStream(stream: Stream): Observable<FileUploadResponse> {
    if (stream === null || stream === undefined) {
      throw new Error('Upload data is required');
    }

    return this.fileRepository.addStream(stream).pipe(
      map(hash => {
        return new FileUploadResponse(hash, Date.now());
      })
    );
  }
}
