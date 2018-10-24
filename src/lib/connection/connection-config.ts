import { BlockchainNetworkConnection } from './blockchain-network-connection';
import { FileStorageConnection } from './file-storage-connection';
import { IpfsConnection } from './ipfs-connection';
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

export class ConnectionConfig {
  public static createWithLocalIpfsConnection(
    blockchainNetworkConnection: BlockchainNetworkConnection,
    ifpsConnection: IpfsConnection
  ): ConnectionConfig {
    return new ConnectionConfig(blockchainNetworkConnection, ifpsConnection);
  }

  public static createWithStorageConnection(
    blockchainNetworkConnection: BlockchainNetworkConnection,
    storageConnection: StorageConnection
  ): ConnectionConfig {
    return new ConnectionConfig(blockchainNetworkConnection, storageConnection);
  }

  constructor(
    public readonly blockchainNetworkConnection: BlockchainNetworkConnection,
    public fileStorageConnection: FileStorageConnection
  ) {}
}
