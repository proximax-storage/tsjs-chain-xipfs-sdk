import {Observable} from 'rxjs';
import {Stream} from "stream";

export interface FileRepository {
  addStream(stream: Stream): Observable<string>;
  getStream(dataHash: string): Observable<Stream>;
}
