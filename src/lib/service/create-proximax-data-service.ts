import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConnectionConfig } from '../connection/connection-config';
import { DigestUtils } from '../helper/digest-util';
import { ProximaxDataModel } from '../model/proximax/data-model';
import { AbstractByteStreamParameterData } from '../upload/abstract-byte-stream-parameter-data';
import { UploadParameter } from '../upload/upload-parameter';
import { FileUploadService } from './file-upload-service';

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

export class CreateProximaxDataService {
  private fileUploadService: FileUploadService;

  constructor(connectionConfig: ConnectionConfig) {
    this.fileUploadService = new FileUploadService(connectionConfig);
    // console.log(this.ipfsClient);
  }

  public createData(param: UploadParameter): Observable<ProximaxDataModel> {
    if (param === null) {
      throw new Error('upload parameter is required');
    }

    if (param.data instanceof AbstractByteStreamParameterData) {
      const byteStreamParamData = param.data as AbstractByteStreamParameterData;

      // auto detect content type
      let contentType = byteStreamParamData.contentType;
      if (
        (contentType === undefined ||
          contentType === null ||
          contentType.length <= 0) &&
        param.detectContentType
      ) {
        const fileType = require('file-type');

        const mimeType = fileType(byteStreamParamData.getByteStream());

        contentType =
          mimeType === null || mimeType === undefined
            ? 'text/plain'
            : mimeType.mime;

        console.log(contentType);
      }

      // encrypt data
      const encryptedData = param.privacyStrategy.encrypt(
        byteStreamParamData.getByteStream()
      );

      // calculate digest
      let digestHash = '';
      if (param.computeDigest) {
        digestHash = DigestUtils.computeDigest(encryptedData);
      }

      return this.fileUploadService.uploadStream(encryptedData).pipe(
        map(fur => {
          return new ProximaxDataModel(
            fur.hash,
            digestHash,
            param.data.description,
            contentType,
            param.data.metadata,
            param.data.name,
            fur.timestamp
          );
        })
      );
    } else {
      return of(new ProximaxDataModel('replaceme'));
    }
  }
}
