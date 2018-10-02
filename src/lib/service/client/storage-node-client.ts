import { Observable } from 'rxjs';
import { StorageConnection } from '../../connection/storage-connection';
import { FileRepository } from '../repository/file-repository';
export class StorageNodeClient implements FileRepository {
  constructor(storageConnection: StorageConnection) {
    console.log(storageConnection);
  }

  public addStream(data: any, options?: object): Observable<string> {
    console.log(data);
    console.log(options);
    throw new Error('Method not implemented.');
  }

  public getStream(dataHash: string, options?: object): Observable<any> {
    console.log(dataHash);
    console.log(options);
    throw new Error('Method not implemented.');
  }
}
