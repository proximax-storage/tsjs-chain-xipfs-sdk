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
import { StringParameterData } from './string-parameter-data';
import { UploadParameterData } from './upload-parameter-data';

describe('UploadParameterData', () => {
  it('should throw error if the upload parameter data name length more than 100 characters', () => {
    expect(() => {
      const name =
        'vphOlpiuPmKFhSKRLqMtG4pkL6n1VPvXzRfitdKcHCpwe3i9Ac1TujbVoW4Zi8P4lFTrPOYMD60yBqM7YgTAopA3vS20GGThYZpDm126464';
      const metadata = new Map<string, string>();
      metadata.set('Author', 'Proximax');
      StringParameterData.create(
        'test',
        'utf8',
        name,
        'test',
        'test',
        metadata
      );
    }).to.throw();
  });

  it('should throw error if the upload parameter data description length more than 100 characters', () => {
    expect(() => {
      const description =
        'vphOlpiuPmKFhSKRLqMtG4pkL6n1VPvXzRfitdKcHCpwe3i9Ac1TujbVoW4Zi8P4lFTrPOYMD60yBqM7YgTAopA3vS20GGThYZpDm12';
      const metadata = new Map<string, string>();
      metadata.set('Author', 'Proximax');
      StringParameterData.create(
        'test',
        'utf8',
        'Test',
        description,
        'text/plain',
        metadata
      );
    }).to.throw();
  });

  it('should throw error if the upload parameter data content length more than 30 characters', () => {
    expect(() => {
      const contentType = 'vphOlpiuPmKFhSKRLqMtG4pkL6n1VPvXzRfitdKcHC';
      const metadata = new Map<string, string>();
      metadata.set('Author', 'Proximax');
      StringParameterData.create(
        'test',
        'utf8',
        'Testing',
        'Description',
        contentType,
        metadata
      );
    }).to.throw();
  });

  it('should create upload parameter data', () => {
    const name = 'Proximax Test';
    const description = 'Proximax description';
    const contentType = 'text/plain';
    const metadata = new Map<string, string>();
    metadata.set('Author', 'Proximax');
    const uploadParameterData = StringParameterData.create(
      'test',
      'utf8',
      name,
      description,
      contentType,
      metadata
    );
    // console.log(uploadParameterData);
    expect(uploadParameterData).to.be.a.instanceof(UploadParameterData);
  });
});
