import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProximaxDataModel } from '../model/proximax/data-model';
import { UploadParameter } from '../model/upload/upload-parameter';
import { IpfsClient } from './client/ipfs-client';

export class ProximaxDataService {
  private client: IpfsClient;

  constructor(client: IpfsClient) {
    this.client = client;
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
