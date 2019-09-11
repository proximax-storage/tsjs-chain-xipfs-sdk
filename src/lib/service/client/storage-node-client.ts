import request from 'request';
import { from, Observable } from 'rxjs';
import { Stream } from 'stream';
import { StorageConnection } from '../../connection/storage-connection';
import { StreamHelper } from '../../helper/stream-helper';
import { FileRepository } from '../repository/file-repository';
import { NodeInfoResponse } from './node-info-response';

export class StorageNodeClient implements FileRepository {
  public static readonly HEADER_CREDENTIALS = 'HeaderCredentials';

  private readonly apiUrl: string;
  private readonly headerCredentials: string;

  constructor(public readonly storageConnection: StorageConnection) {
    this.apiUrl = storageConnection.getApiUrl();
    this.headerCredentials = `NemAddress=${
      storageConnection.nemAddress
    }; Bearer ${storageConnection.bearerToken}`;
  }

  public addStream(stream: Stream): Observable<string> {
    const headers = {};
    headers[StorageNodeClient.HEADER_CREDENTIALS] = this.headerCredentials;
    const formData = {
      file: stream
    };

    return from(
      new Promise<string>((resolve, reject) => {
        request
          .post(this.apiUrl + '/upload/file', { headers, formData })
          .on('response', response =>
            resolve(
              StreamHelper.stream2String(response).then(
                resp => JSON.parse(resp).dataHash
              )
            )
          )
          .on('error', err => reject(err));
      }).then()
    );
  }

  public getStream(dataHash: string): Observable<Stream> {
    const headers = {};
    headers[StorageNodeClient.HEADER_CREDENTIALS] = this.headerCredentials;

    return from(
      new Promise<Stream>((resolve, reject) => {
        request
          .get(this.apiUrl + `/upload/file?dataHash=${dataHash}`, { headers })
          .on('response', stream => resolve(stream))
          .on('error', err => reject(err));
      })
    );
  }

  public getNodeInfo(): Observable<NodeInfoResponse> {
    const headers = {};
    headers[StorageNodeClient.HEADER_CREDENTIALS] = this.headerCredentials;

    return from(
      new Promise<NodeInfoResponse>((resolve, reject) => {
        request
          .get(this.apiUrl + `/node/info`, { headers })
          .on('response', response =>
            resolve(
              StreamHelper.stream2String(response).then(
                resp => JSON.parse(resp) as NodeInfoResponse
              )
            )
          )
          .on('error', err => reject(err));
      })
    );
  }
}
