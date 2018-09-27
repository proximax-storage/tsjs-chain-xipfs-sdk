import { Observable } from 'rxjs';
export interface FileRepository {
  addStream(data: any): Observable<string>;
  getStream(dataHash: string): Observable<any>;
}
