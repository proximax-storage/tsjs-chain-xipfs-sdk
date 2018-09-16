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

import { PrivacyType } from '../../privacy/privacy-type';
import { UploadParameterData } from './upload-parameter-data';

/**
 * Class represetns the upload parameter
 */
export class UploadParameter {
  constructor(
    public data: UploadParameterData,
    public signerPrivateKey: string,
    public privacyStrategy: PrivacyType,
    public version?: string,
    public recipientPublicKey?: string,
    public recipientAddress?: string,
    public transactionDeadline?: number,
    public useBlockhainSecureMessage?: boolean,
    public detectContentType?: boolean
  ) {}

  public validate(): void {
    if (!this.data.byteStreams) {
      throw new Error('data input stream or bytes is required');
    }

    if (!this.signerPrivateKey || this.signerPrivateKey.length <= 0) {
      throw new Error('singer privacy key is required');
    }
  }
}
