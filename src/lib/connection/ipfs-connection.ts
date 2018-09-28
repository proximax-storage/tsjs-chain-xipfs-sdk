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

/**
 * Class represents the ipfs connection
 */
export class IpfsConnection {
  private IPFS: any;

  /**
   * Constructor
   * @param apiHost the ifps host
   * @param apiPort the ipfs port
   * @param options the protocol options e.g. { protocol: 'http' }
   */
  constructor(
    public apiHost: string,
    public apiPort?: number,
    public options?: object
  ) {
    if (!this.apiHost) {
      throw new Error('Ipfs host or multi adddress is required');
    }
   
    if (this.apiPort && this.apiPort <= 0) {
      throw new Error('Ipfs port should not be negative');
    }

    const API = require('ipfs-api');
    this.IPFS = new API(apiHost, apiPort, options);
  }

  /**
   * Return instance of ipfs api
   */
  public getIpfs() {
    return this.IPFS;
  }
}
