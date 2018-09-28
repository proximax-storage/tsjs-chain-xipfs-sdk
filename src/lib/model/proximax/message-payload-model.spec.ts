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
import { ProximaxDataModel } from './data-model';
import { ProximaxMessagePayloadModel } from './message-payload-model';

describe('ProximaxMessagePayloadModel', () => {
  it('should throw error if the proximax message payload model did not have valid privacy type', () => {
    expect(() => {
      new ProximaxMessagePayloadModel(
        12,
        new ProximaxDataModel(''),
        SchemaVersion
      );
    }).to.throw();
  });

  it('should throw error if the proximax message payload model did not have valid proximax data model', () => {
    expect(() => {
      const data = new ProximaxDataModel('');
      new ProximaxMessagePayloadModel(PrivacyType.PLAIN, data, SchemaVersion);
    }).to.throw();
  });

  it('should create proximax message payload model with data hash', () => {
    const dataModel = new ProximaxDataModel(
      'QmWDQegEhLdCUWF6aQZcLM6ELPTuWHfvjLYBeG6Kxy8hjs'
    );

    const messagePayloadModel = new ProximaxMessagePayloadModel(
      PrivacyType.PLAIN,
      dataModel,
      SchemaVersion
    );

    expect(messagePayloadModel.data).to.be.not.equal(undefined);
    expect(messagePayloadModel.privacyType).to.be.equal(PrivacyType.PLAIN);
  });
});
