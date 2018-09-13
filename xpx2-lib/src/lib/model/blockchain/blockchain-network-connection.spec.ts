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
import { BlockchainInfo } from '../../config/config.spec';
import { BlockchainNetworkConnection } from './blockchain-network-connection';
import { BlockchainNetworkType } from './blockchain-network-type';

describe('BlockChainNetworkConnection', () => {
  it('should throw error if the blockchain network type is invalid', () => {
    expect(() => {
      const connection = new BlockchainNetworkConnection(
        1,
        BlockchainInfo.endpointUrl,
        BlockchainInfo.socketUrl,
        BlockchainInfo.gatewayUrl
      );

      connection.validate();
    }).to.throw();
  });

  it('should throw error if the blockchain endpoint url is invalid', () => {
    expect(() => {
      const connection = new BlockchainNetworkConnection(
        BlockchainNetworkType.MIJIN_TEST,
        '',
        BlockchainInfo.socketUrl,
        BlockchainInfo.gatewayUrl
      );

      connection.validate();
    }).to.throw();
  });

  it('should create new instance of BlockchainNetworkConnection', () => {
    const connection = new BlockchainNetworkConnection(
      BlockchainNetworkType.MIJIN_TEST,
      BlockchainInfo.endpointUrl,
      BlockchainInfo.socketUrl,
      BlockchainInfo.gatewayUrl
    );

    expect(connection.network).to.not.be.equal(undefined);
    expect(connection.endpointUrl).to.not.be.equal(undefined);
    expect(connection.socketUrl).to.not.be.equal(undefined);
    expect(connection.gatewayUrl).to.not.be.equal(undefined);
  });
});
