import { Observable } from 'rxjs';
export interface FileRepository {
  addStream(data: any, option?: object): Observable<string>;
  getStream(dataHash: string, option?: object): Observable<any>;
}
