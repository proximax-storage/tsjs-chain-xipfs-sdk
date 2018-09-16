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
import { ProximaxDataModel } from '../proximax/data-model';
import { UploadResult } from './upload-result';

describe('UploadResult', () => {
  it('should create upload result', () => {
    const uploadResult = new UploadResult(
      '',
      PrivacyType.PLAIN,
      SchemaVersion,
      new ProximaxDataModel('')
    );
    expect(uploadResult).to.be.not.equal(undefined);
  });
});
