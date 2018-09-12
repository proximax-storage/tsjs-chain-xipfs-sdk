import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DownloadResultData } from '../model/download/download-result-data';
import { ProximaxDataModel } from '../model/proximax/data-model';
import { UploadParameter } from '../model/upload/upload-parameter';
import { IpfsClient } from './client/ipfs-client';

export class ProximaxDataService {
  private client: IpfsClient;

  constructor(client: IpfsClient) {
    this.client = client;
  }

  public getData(data: ProximaxDataModel): Observable<DownloadResultData> {
    if (!data.dataHash) {
      throw new Error('Data hash is required');
    }

    return this.client.getStream(data.dataHash).pipe(
      map(response => {
        // console.log(response);
        const myContent = response[0].content;
        return new DownloadResultData(
          myContent,
          data.digest!,
          data.dataHash!,
          data.timestamp!,
          data.description,
          data.contentType,
          data.name,
          data.metadata
        );
      })
    );
  }

  public createData(param: UploadParameter): Observable<ProximaxDataModel> {
    if (!param) {
      throw new Error('upload parameter is required');
    }

    if (!param.data) {
      throw new Error('upload paramater data is required');
    }

    return this.client
      .addStream(param.data.byteStreams, param.data.options)
      .pipe(
        map(hash => {
          // TODO : need to calculate the digest
          const digest = '';
          const dataHash = hash;

          return new ProximaxDataModel(
            digest,
            dataHash,
            param.data.description,
            param.data.contentType,
            param.data.metadata,
            param.data.name,
            Date.now()
          );
        })
      );
  }
}
