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

import { PrivacyStrategy } from '../privacy/privacy';
import { DirectDownloadParameterBuilder } from './direct-download-parameter-builder';

/**
 * This model class is the input parameter of direct download.
 */
export class DirectDownloadParameter {
  /**
   * Start creating instance of this class from transaction hash, account private key and validate digest flag using DirectDownloadParameterBuilder
   * @param transactionHash the transaction hash of target download
   * @param accountPrivateKey the account private key
   * @param validateDigest the validate digest flag as to whether to verify data with digest
   * @return the direct download parameter builder
   */
  public static createFromTransactionHash(
    transactionHash: string,
    accountPrivateKey?: string,
    validateDigest?: boolean
  ): DirectDownloadParameterBuilder {
    return DirectDownloadParameterBuilder.createFromTransactionHash(
      transactionHash,
      accountPrivateKey,
      validateDigest
    );
  }

  /**
   * Start creating instance of this class from data hash and digest using DirectDownloadParameterBuilder
   * @param dataHash the data hash to download
   * @param digest the digest to verify download
   * @return the direct download parameter builder
   */
  public static createFromDataHash(
    dataHash: string,
    digest?: string
  ): DirectDownloadParameterBuilder {
    return DirectDownloadParameterBuilder.createFromDataHash(dataHash, digest);
  }

  constructor(
    /**
     * The privacy strategy
     */
    public readonly privacyStrategy: PrivacyStrategy,
    /**
     * Determines to validate digest
     */
    public readonly validateDigest: boolean,
    /**
     * The transaction hash
     */
    public readonly transactionHash?: string,
    /**
     * The sender or recipient account private key to download secure message of a transaction (if downloading by transaction hash)
     */
    public readonly accountPrivateKey?: string,
    /**
     * The data hash
     */
    public readonly dataHash?: string,
    /**
     * The digest for the data (if downloading by data hash)
     */
    public readonly digest?: string
  ) {}
}
