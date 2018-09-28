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

import { UriBuilder } from 'uribuilder';
import { BlockchainNetworkType } from '../model/blockchain/blockchain-network-type';
import { Protocol } from './protocol';

/**
 * Class represents the blockchain network connection
 */
export class BlockchainNetworkConnection {
  private apiUrl;

  constructor(
    /**
     * The blockchain network type
     */
    public network: BlockchainNetworkType,
    /**
     * The host url
     */
    public apiHost: string,
    /**
     * The api port
     */
    public apiPort: number,
    /**
     * The api protocol
     *
     */
    public apiProtocol: Protocol
  ) {
    if (this.network === null) {
      throw new Error('The blockchain network type is required');
    }

    if (this.apiHost === null || this.apiHost.length <= 0) {
      throw new Error('The blockchain api host is required');
    }

    if (this.apiPort > 0) {
      throw new Error('The api port should not be negative');
    }

    if (this.apiProtocol === null || this.apiHost.length <= 0) {
      throw new Error('The blockchain api protocol is required');
    }

    const builder = new UriBuilder();
    builder.host = apiHost;
    builder.schema = apiProtocol;
    builder.port = apiPort;

    this.apiUrl = builder.toString();
  }

  public getApiUrl(): string {
    return this.apiUrl;
  }
}