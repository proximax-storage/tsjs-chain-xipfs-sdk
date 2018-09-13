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

import { BlockchainNetworkType } from './blockchain-network-type';

/**
 * Class represents the blockchain network connection
 */
export class BlockchainNetworkConnection {
  constructor(
    /**
     * The blockchain network type
     */
    public network: BlockchainNetworkType,
    /**
     * The endpoint url
     */
    public endpointUrl: string,
    /**
     * The web socket endpoint url
     */
    public socketUrl?: string,
    /**
     * The gateway endpoint url
     * Note: require nem2-camel installed
     */
    public gatewayUrl?: string
  ) {}

  /**
   * Validates the blockchain network connection
   */
  public validate(): void {
    if (!this.network || !(this.network in BlockchainNetworkType)) {
      throw new Error('The blockchain network type is required');
    }

    if (!this.endpointUrl || this.endpointUrl.length <= 0) {
      throw new Error('The blockchain endpoint url is required');
    }
  }
}
