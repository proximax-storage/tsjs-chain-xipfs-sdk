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

import { PrivacyType } from '../../privacy/privacy-type';

/**
 * Class represents download parameter
 */
export class DownloadParameter {
  constructor(
    /**
     * The transaction has
     */
    public transactionHash: string,
    /**
     * The sender or recipient account private key
     */
    public accountPrivateKey?: string,
    /**
     * The privacy strategy
     */
    public privacyStrategy?: PrivacyType,
    /**
     * Determines to validate digest
     */
    public validateDigest?: boolean
  ) {}

  /**
   * Validates the download parameter
   */
  public validate(): void {
    if (this.transactionHash.length <= 0) {
      throw new Error('The transaction hash is required');
    }

    if (
      this.privacyStrategy === PrivacyType.NEM_KEYS &&
      this.accountPrivateKey!.length <= 0
    ) {
      throw new Error('The account private key is required');
    }
  }
}
