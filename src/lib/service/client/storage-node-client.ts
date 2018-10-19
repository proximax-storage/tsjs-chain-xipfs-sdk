import { Observable } from 'rxjs';
import { StorageConnection } from '../../connection/storage-connection';
import { FileRepository } from '../repository/file-repository';

export class StorageNodeClient implements FileRepository {
  constructor(public readonly storageConnection: StorageConnection) {}

  public addStream(): Observable<string> {
    throw new Error('Method not implemented.');
  }

  public getStream(): Observable<any> {
    throw new Error('Method not implemented.');
  }
}
