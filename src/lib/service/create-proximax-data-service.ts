import { Observable } from 'rxjs';
import { ConnectionConfig } from '../connection/connection-config';
import { UploadParameter } from '../upload/upload-parameter';
import { IpfsClient } from './client/ipfs-client';

import { map } from 'rxjs/operators';
import { ProximaxDataModel } from '../model/proximax/data-model';
export class CreateProximaxDataService {
  private ipfsClient: IpfsClient;
  constructor(connectionConfig: ConnectionConfig) {
    this.ipfsClient = new IpfsClient(connectionConfig.ifpsConnection!);
    console.log(this.ipfsClient);
  }

  public createData(param: UploadParameter): Observable<ProximaxDataModel> {
    if (param === null) {
      throw new Error('upload parameter is required');
    }

    // console.log('Add data to ipfs')
    // console.log(param.data);

    let contentType = param.data.contentType;
    if (
      (contentType === undefined ||
        contentType === null ||
        contentType.length <= 0) &&
      param.detectContentType
    ) {
      const fileType = require('file-type');

      contentType = fileType(Buffer.from(param.data.byteStreams)).mime;
      console.log(contentType);
    }

    return this.ipfsClient
      .addStream(param.data.byteStreams, param.data.options)
      .pipe(
        map(hash => {
          // TODO : need to calculate the digest
          const digest = '';
          const dataHash = hash;

          return new ProximaxDataModel(
            dataHash,
            digest,
            param.data.description,
            contentType,
            param.data.metadata,
            param.data.name,
            Date.now()
          );
        })
      );
  }
}
