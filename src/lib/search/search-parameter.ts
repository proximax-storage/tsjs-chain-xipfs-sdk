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

import { TransactionFilter } from '../model/blockchain/transaction-filter';
import { SearchParameterBuilder } from './search-parameter-builder';

/**
 * This model class is the input parameter of search.
 */
export class SearchParameter {
  public static createForAddress(
    accountAddress: string
  ): SearchParameterBuilder {
    return SearchParameterBuilder.createForAddress(accountAddress);
  }

  public static createForPublicKey(
    accountPublicKey: string
  ): SearchParameterBuilder {
    return SearchParameterBuilder.createForPublicKey(accountPublicKey);
  }

  public static createForPrivateKey(
    accountPrivateKey: string
  ): SearchParameterBuilder {
    return SearchParameterBuilder.createForPrivateKey(accountPrivateKey);
  }

  public constructor(
    public readonly transactionFilter: TransactionFilter,
    public readonly resultSize: number,
    public readonly accountAddress?: string,
    public readonly accountPublicKey?: string,
    public readonly accountPrivateKey?: string,
    public readonly nameFilter?: string,
    public readonly descriptionFilter?: string,
    public readonly metadataKeyFilter?: string,
    public readonly metadataValueFilter?: string,
    public readonly fromTransactionId?: string
  ) {}
}
