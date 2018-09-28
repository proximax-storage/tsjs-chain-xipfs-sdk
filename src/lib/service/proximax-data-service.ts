import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DownloadResultData } from '../download/download-result-data';
import { ProximaxDataModel } from '../model/proximax/data-model';
import { UploadParameter } from '../upload/upload-parameter';
import { IpfsClient } from './client/ipfs-client';
/*
 * Copyright 2018 ProximaX Limited
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Class represents Proximax data service
 */
export class ProximaxDataService {
  private client: IpfsClient;

  /**
   * Constructor
   * @param client the ipfs client
   */
  constructor(client: IpfsClient) {
    this.client = client;
  }

  /**
   * Get the content from ipfs storage based on Proximax data model
   * @param data the proximax data model
   */
  public getData(data: ProximaxDataModel): Observable<DownloadResultData> {
    if (!data.dataHash) {
      throw new Error('Data hash is required');
    }

    return this.client.getStream(data.dataHash).pipe(
      map(response => {
        // console.log(response);
        const myContent = response[0].content;
        return new DownloadResultData(
          data.dataHash,
          data.timestamp!,
          myContent,
          data.digest,
          data.description,
          data.contentType,
          data.name,
          data.metadata
        );
      })
    );
  }

  /**
   * Adds content to the ipfs storage
   * @param param the upload parameter
   */
  public addData(param: UploadParameter): Observable<ProximaxDataModel> {
    if (!param) {
      throw new Error('upload parameter is required');
    }

    if (!param.data) {
      throw new Error('upload parameter data is required');
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

    return this.client
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
