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
import { SearchParameter } from './search-parameter';

export class SearchParameterBuilder {
  public static createForAddress(
    accountAddress: string
  ): SearchParameterBuilder {
    if (!accountAddress) {
      throw new Error('accountAddress is required');
    }

    const searchParameterBuilder = new SearchParameterBuilder();
    searchParameterBuilder.accountAddress = accountAddress;
    return searchParameterBuilder;
  }

  public static createForPublicKey(
    accountPublicKey: string
  ): SearchParameterBuilder {
    if (!accountPublicKey) {
      throw new Error('accountPublicKey is required');
    }

    const searchParameterBuilder = new SearchParameterBuilder();
    searchParameterBuilder.accountPublicKey = accountPublicKey;
    return searchParameterBuilder;
  }

  public static createForPrivateKey(
    accountPrivateKey: string
  ): SearchParameterBuilder {
    if (!accountPrivateKey) {
      throw new Error('accountPrivateKey is required');
    }

    const searchParameterBuilder = new SearchParameterBuilder();
    searchParameterBuilder.accountPrivateKey = accountPrivateKey;
    return searchParameterBuilder;
  }

  private transactionFilter?: TransactionFilter;
  private resultSize?: number;
  private nameFilter?: string;
  private descriptionFilter?: string;
  private metadataKeyFilter?: string;
  private metadataValueFilter?: string;
  private accountAddress?: string;
  private accountPublicKey?: string;
  private accountPrivateKey?: string;
  private fromTransactionId?: string;

  public withTransactionFilter(
    transactionFilter?: TransactionFilter
  ): SearchParameterBuilder {
    this.transactionFilter = transactionFilter;
    return this;
  }

  public withResultSize(resultSize?: number): SearchParameterBuilder {
    /*if (resultSize !== undefined && (resultSize < 1 || resultSize > 20)) {
      throw new Error('result size should be between 1 and 20');
    }*/
    this.resultSize = resultSize;
    return this;
  }

  public withNameFilter(nameFilter?: string): SearchParameterBuilder {
    this.nameFilter = nameFilter;
    return this;
  }

  public withDescriptionFilter(
    descriptionFilter?: string
  ): SearchParameterBuilder {
    this.descriptionFilter = descriptionFilter;
    return this;
  }

  public withMetadataKeyFilter(
    metadataKeyFilter?: string
  ): SearchParameterBuilder {
    this.metadataKeyFilter = metadataKeyFilter;
    return this;
  }

  public withMetadataValueFilter(
    metadataValueFilter?: string
  ): SearchParameterBuilder {
    this.metadataValueFilter = metadataValueFilter;
    return this;
  }

  public withFromTransactionId(
    fromTransactionId?: string
  ): SearchParameterBuilder {
    this.fromTransactionId = fromTransactionId;
    return this;
  }

  public build(): SearchParameter {
    return new SearchParameter(
      this.transactionFilter || TransactionFilter.OUTGOING,
      this.resultSize || 10,
      this.accountAddress,
      this.accountPublicKey,
      this.accountPrivateKey,
      this.nameFilter,
      this.descriptionFilter,
      this.metadataKeyFilter,
      this.metadataValueFilter,
      this.fromTransactionId
    );
  }
}
