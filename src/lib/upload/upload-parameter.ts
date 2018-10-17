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

// import {FilesAsZipParameterData} from "./files-as-zip-parameter-data";
import { SchemaVersion } from '../config/config';
import { PrivacyStrategy } from '../privacy/privacy';
import { FileParameterData } from './file-parameter-data';
import { PathParameterData } from './path-parameter-data';
import { StringParameterData } from './string-parameter-data';
import { Uint8ArrayParameterData } from './uint8-array-parameter-data';
import { UploadParameterBuilder } from './upload-parameter-builder';
import { UploadParameterData } from './upload-parameter-data';
import { UrlResourceParameterData } from './url-resource-parameter-data';

/**
 * Class represetns the upload parameter
 */
export class UploadParameter {
  public static createForFileUpload(
    file: string | FileParameterData,
    signerPrivateKey: string
  ): UploadParameterBuilder {
    return new UploadParameterBuilder(
      file instanceof String
        ? FileParameterData.create(file as string)
        : (file as FileParameterData),
      signerPrivateKey
    );
  }

  public static createForUint8ArrayUpload(
    data: Uint8Array | Uint8ArrayParameterData,
    signerPrivateKey: string
  ): UploadParameterBuilder {
    return new UploadParameterBuilder(
      data instanceof Uint8Array
        ? Uint8ArrayParameterData.create(data as Uint8Array)
        : (data as Uint8ArrayParameterData),
      signerPrivateKey
    );
  }

  public static createForStringUpload(
    text: string | StringParameterData,
    signerPrivateKey: string
  ): UploadParameterBuilder {
    return new UploadParameterBuilder(
      text instanceof String
        ? StringParameterData.create(text as string)
        : (text as StringParameterData),
      signerPrivateKey
    );
  }

  public static createForUrlResourceUpload(
    url: string | UrlResourceParameterData,
    signerPrivateKey: string
  ): UploadParameterBuilder {
    return new UploadParameterBuilder(
      url instanceof String
        ? UrlResourceParameterData.create(url as string)
        : (url as UrlResourceParameterData),
      signerPrivateKey
    );
  }

  // TODO
  // public static createForFilesAsZipUpload(files: string[] | FilesAsZipParameterData, signerPrivateKey: string): UploadParameterBuilder {
  //   return UploadParameter.createForUrlResourceUpload(
  //     files instanceof string[] ? FilesAsZipParameterData.create(files) : files, signerPrivateKey);
  // }

  public static createForPathUpload(
    path: string | PathParameterData,
    signerPrivateKey: string
  ): UploadParameterBuilder {
    return new UploadParameterBuilder(
      path instanceof String
        ? PathParameterData.create(path as string)
        : (path as PathParameterData),
      signerPrivateKey
    );
  }

  public readonly version: string;

  public constructor(
    public readonly data: UploadParameterData,
    public readonly signerPrivateKey: string,
    public readonly privacyStrategy: PrivacyStrategy,
    public readonly transactionDeadline: number,
    public readonly useBlockchainSecureMessage: boolean,
    public readonly detectContentType: boolean,
    public readonly computeDigest: boolean,
    public readonly recipientPublicKey?: string,
    public readonly recipientAddress?: string
  ) {
    this.version = SchemaVersion;
  }
}
