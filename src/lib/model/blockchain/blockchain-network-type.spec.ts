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
import { BlockchainNetworkType } from './blockchain-network-type';

describe('BlockchainNetworkType', () => {
  it('MAIN_NET is 104', () => {
    expect(BlockchainNetworkType.MAIN_NET).to.be.equal(104);
  });

  it('MIJIN is 96', () => {
    expect(BlockchainNetworkType.MIJIN).to.be.equal(96);
  });

  it('TEST_NET is 152', () => {
    expect(BlockchainNetworkType.TEST_NET).to.be.equal(152);
  });

  it('MIJIN_TEST is 104', () => {
    expect(BlockchainNetworkType.MIJIN_TEST).to.be.equal(144);
  });
});
