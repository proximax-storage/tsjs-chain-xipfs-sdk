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

import { DownloadResultData } from './download-result-data';

describe('DownloadResultData', () => {
  it('should create the download result data', () => {
    const downloadResultData = new DownloadResultData(
      'QmUD7uG5prAMHbcCfp4x1G1mMSpywcSMHTGpq62sbpDAg6',
      123231432
    );
    expect(downloadResultData.dataHash).to.be.not.equal(undefined);
    expect(downloadResultData.timestamp).to.be.not.equal(undefined);
  });
});
