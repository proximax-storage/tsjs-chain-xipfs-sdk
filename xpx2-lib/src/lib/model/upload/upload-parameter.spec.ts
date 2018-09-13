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
import { PrivacyType } from '../../privacy/privacy-type';
import { UploadParameter } from './upload-parameter';
import { UploadParameterData } from './upload-parameter-data';

describe('UploadParameter', () => {
  it('should throw error if the upload parameter did not have valid signer private key', () => {
    expect(() => {
      const uploadParam = new UploadParameter(
        new UploadParameterData(''),
        '',
        PrivacyType.PLAIN
      );

      uploadParam.validate();
    }).to.throw();
  });

  it('should create upload parameter data', () => {
    const uploadParameterData = new UploadParameterData(
      Buffer.from('Proximax P2P storage')
    );
    const uploadParam = new UploadParameter(
      uploadParameterData,
      '94EB884DE6AD35227C36A2C7B394837962C6935C80630DA4D4AE04753E60213E',
      PrivacyType.PLAIN
    );

    uploadParam.validate();

    expect(uploadParam).to.be.not.equal(undefined);
  });
});
