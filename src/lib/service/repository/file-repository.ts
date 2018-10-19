import { Observable } from 'rxjs';

export interface FileRepository {
  addStream(data: any): Observable<string>;
  getStream(dataHash: string, option?: object): Observable<any>;
}
