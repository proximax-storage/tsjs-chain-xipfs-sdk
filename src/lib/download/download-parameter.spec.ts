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

import { PlainPrivacyStrategy } from '../privacy/plain-privacy';
import { PrivacyType } from '../privacy/privacy-type';
import { DownloadParameter } from './download-parameter';

describe('DownloadParameter', () => {
  const sampleTransactionHash = '';

  it('should throw error if the download parameter did not have transaction hash', () => {
    expect(() => {
      DownloadParameter.create('');
    }).to.throw();
  });

  it('should throw error if the account private key is invalid for PrivacyType.NEM_KEYS', () => {
    expect(() => {
      DownloadParameter.create(sampleTransactionHash).withAccountPrivateKey(
        'ZZZZZZZ'
      );
    }).to.throw();
  });

  it('should create download parameter', () => {
    const downloadParameter = new DownloadParameter(
      'F6F901704BB271F7CE2E4FD6BC38A9715EC3752000AEDF0AA67CE38BD07EC42E',
      'F6F901704BB271F7CE2E4FD6BC38A9715EC3752000AEDF0AA67CE38BD07EC42E',
      '0DC05CB635D5DA08C190C3FB1BA15EC0E27A15CD90A91E97FB7DD2D5E7C30392',
      PlainPrivacyStrategy.create(),
      false
    );

    expect(downloadParameter.transactionHash).to.not.be.equal(undefined);
    expect(downloadParameter.accountPrivateKey).to.not.be.equal(undefined);
    expect(downloadParameter.privacyStrategy!.getPrivacyType()).to.be.equal(
      PrivacyType.PLAIN
    );
    expect(downloadParameter.validateDigest).to.be.false;
  });
});
