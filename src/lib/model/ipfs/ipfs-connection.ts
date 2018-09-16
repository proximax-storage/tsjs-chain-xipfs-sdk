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
  private API: any;

  /**
   * Constructor
   * @param host the ifps host
   * @param port the ipfs port
   * @param options the protocol options e.g. { protocol: 'http' }
   */
  constructor(
    public readonly host: string,
    public readonly port?: string,
    public readonly options?: object
  ) {
    const API = require('ipfs-api');
    this.API = new API(host, port, options);
  }

  /**
   * Return instance of ipfs api
   */
  public getAPI() {
    return this.API;
  }

  /**
   * Validates the ipfs connection
   */
  public validate(): void {
    if (!this.host) {
      throw new Error('Ipfs host or multi adddress is required');
    }
  }
}
