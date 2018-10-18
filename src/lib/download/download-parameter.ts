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
import { DownloadParameterBuilder } from './download-parameter-builder';

/**
 * Class represents download parameter
 */
export class DownloadParameter {
  public static create(transactionHash: string): DownloadParameterBuilder {
    return new DownloadParameterBuilder(transactionHash);
  }

  constructor(
    /**
     * The transaction has
     */
    public readonly transactionHash: string,
    /**
     * The privacy strategy
     */
    public readonly privacyStrategy: PrivacyStrategy,
    /**
     * Determines to validate digest
     */
    public readonly validateDigest: boolean,
    /**
     * The sender or recipient account private key
     */
    public readonly accountPrivateKey?: string
  ) {}
}
