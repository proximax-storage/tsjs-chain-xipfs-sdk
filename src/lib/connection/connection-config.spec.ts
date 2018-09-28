import 'mocha';

import { expect } from 'chai';
import { StorageInfo } from '../config/config.spec';
import { BlockchainNetworkType } from '../model/blockchain/blockchain-network-type';
import { BlockchainNetworkConnection } from './blockchain-network-connection';
import { ConnectionConfig } from './connection-config';
import { IpfsConnection } from './ipfs-connection';
import { Protocol } from './protocol';
import { StorageConnection } from './storage-connection';
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
describe('ConnectionConfig', () => {
  it('should createWithLocalIpfsConnection', () => {
    const connectionConfig = ConnectionConfig.createWithLocalIpfsConnection(
      new BlockchainNetworkConnection(
        BlockchainNetworkType.MIJIN_TEST,
        '52.221.231.207',
        3000,
        Protocol.HTTP
      ),
      new IpfsConnection('127.0.0.1', 5001)
    );

    expect(connectionConfig).to.be.a.instanceof(ConnectionConfig);
  });

  it('should createWithStorageConnection', () => {
    const connectionConfig = ConnectionConfig.createWithStorageConnection(
      new BlockchainNetworkConnection(
        BlockchainNetworkType.MIJIN_TEST,
        '52.221.231.207',
        3000,
        Protocol.HTTP
      ),
      new StorageConnection(
        StorageInfo.apiHost,
        StorageInfo.apiPort,
        Protocol.HTTP,
        StorageInfo.bearerToken,
        StorageInfo.address
      )
    );

    expect(connectionConfig).to.be.a.instanceof(ConnectionConfig);
  });
});
