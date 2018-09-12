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

import { expect } from 'chai';
import 'mocha';
import { SchemaVersion } from '../../config/config.spec';
import { PrivacyType } from '../../privacy/privacy-type';
import { DownloadResult } from './download-result';
import { DownloadResultData } from './download-result-data';

describe('DownloadResult', () => {
  it('should create the download result data', () => {
    const downloadResult = new DownloadResult(
      '78402ADBFB9745848A3C1496836F77C92AF63D0BDEDF73C45F004B7C251AADD4',
      PrivacyType.PLAIN,
      SchemaVersion,
      new DownloadResultData(
        'QmUD7uG5prAMHbcCfp4x1G1mMSpywcSMHTGpq62sbpDAg6',
        12131231
      )
    );
    expect(downloadResult.transactionHash).to.be.not.equal(undefined);
    expect(downloadResult.version).to.be.not.equal(undefined);
    expect(downloadResult.privacyType).to.be.equal(PrivacyType.PLAIN);
    expect(downloadResult.data).to.be.not.equal(undefined);
  });
});
