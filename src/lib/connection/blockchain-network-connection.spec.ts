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
import { BlockchainInfo } from '../config/testconfig';
import { BlockchainNetworkType } from '../model/blockchain/blockchain-network-type';
import { BlockchainNetworkConnection } from './blockchain-network-connection';
import { Protocol } from './protocol';

describe('BlockChainNetworkConnection', () => {
  it('should throw error if the blockchain network type is invalid', () => {
    expect(() => {
      new BlockchainNetworkConnection(
        1,
        BlockchainInfo.apiHost,
        BlockchainInfo.apiPort,
        Protocol.HTTP
      );
    }).to.throw();
  });

  it('should throw error if the blockchain api host  is invalid', () => {
    expect(() => {
      new BlockchainNetworkConnection(
        BlockchainNetworkType.MIJIN_TEST,
        '',
        BlockchainInfo.apiPort,
        Protocol.HTTP
      );
    }).to.throw();
  });

  it('should throw error if the blockchain api port  is invalid', () => {
    expect(() => {
      new BlockchainNetworkConnection(
        BlockchainNetworkType.MIJIN_TEST,
        BlockchainInfo.apiHost,
        -1,
        Protocol.HTTP
      );
    }).to.throw();
  });

  it('should throw error if the blockchain api protocol  is invalid', () => {
    expect(() => {
      new BlockchainNetworkConnection(
        BlockchainNetworkType.MIJIN_TEST,
        BlockchainInfo.apiHost,
        BlockchainInfo.apiPort,
        Protocol.UNKNOWN
      );
    }).to.throw();
  });

  it('should create new instance of BlockchainNetworkConnection', () => {
    const connection = new BlockchainNetworkConnection(
      BlockchainNetworkType.MIJIN_TEST,
      BlockchainInfo.apiHost,
      BlockchainInfo.apiPort,
      Protocol.HTTP
    );

    const expectedUrl =
      Protocol.HTTP +
      '://' +
      BlockchainInfo.apiHost +
      ':' +
      BlockchainInfo.apiPort +
      '/';
    // console.log(expectedUrl);
    // console.log(connection.getApiUrl());
    expect(connection).to.be.a.instanceof(BlockchainNetworkConnection);
    expect(connection.getApiUrl()).to.be.equal(expectedUrl);
  });
});
