import {Observable} from 'rxjs';
import {StorageConnection} from '../../connection/storage-connection';
import {FileRepository} from '../repository/file-repository';
import {Stream} from "stream";

export class StorageNodeClient implements FileRepository {
  constructor(public readonly storageConnection: StorageConnection) {}

  public addStream(stream: Stream): Observable<string> {
    throw new Error('Method not implemented.');
  }

  public getStream(dataHash: string): Observable<Stream> {
    throw new Error('Method not implemented.');
  }
}
