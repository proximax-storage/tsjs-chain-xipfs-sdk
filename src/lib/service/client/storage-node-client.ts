import { Observable } from 'rxjs';
import { StorageConnection } from '../../connection/storage-connection';
import { FileRepository } from '../repository/file-repository';
export class StorageNodeClient implements FileRepository {
  constructor(storageConnection: StorageConnection) {
    console.log(storageConnection);
  }

  public addStream(data: any): Observable<string> {
    console.log(data);
    throw new Error('Method not implemented.');
  }

  public getStream(dataHash: string): Observable<any> {
    console.log(dataHash);
    throw new Error('Method not implemented.');
  }
}
