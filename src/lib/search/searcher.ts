import {
  Account,
  Address,
  NetworkType,
  PublicAccount,
  TransferTransaction
} from 'tsjs-xpx-chain-sdk';

import { ConnectionConfig } from '../connection/connection-config';
import { Converter } from '../helper/converter';
import { TransactionFilter } from '../model/blockchain/transaction-filter';
import { ProximaxMessagePayloadModel } from '../model/proximax/message-payload-model';
import { AccountClient } from '../service/client/catapult/account-client';
import { RetrieveProximaxMessagePayloadService } from '../service/retrieve-proximax-message-payload-service';
import { SearchParameter } from './search-parameter';
import { SearchResult } from './search-result';
import { SearchResultItem } from './search-result-item';

export class Searcher {
  private static readonly BATCH_TRANSACTION_SIZE = 100;

  private readonly networkType: NetworkType;
  private readonly accountClient: AccountClient;
  private readonly retrieveProximaxMessagePayloadService: RetrieveProximaxMessagePayloadService;

  constructor(public readonly connectionConfig: ConnectionConfig) {
    this.networkType = Converter.getNemNetworkType(
      this.connectionConfig.blockchainNetworkConnection.networkType
    );
    this.accountClient = new AccountClient(
      connectionConfig.blockchainNetworkConnection
    );
    this.retrieveProximaxMessagePayloadService = new RetrieveProximaxMessagePayloadService(
      connectionConfig.blockchainNetworkConnection
    );
  }

  public async search(param: SearchParameter): Promise<SearchResult> {
    if (!param) {
      throw new Error('param is required');
    }

    let fromTransactionId = param.fromTransactionId;
    let toTransactionId: string | undefined;
    const results: SearchResultItem[] = [];
    

    while (results.length < param.resultSize) {
      let transactions;

      if (param.transactionFilter === TransactionFilter.INCOMING) {
        const address = Address.createFromRawAddress(param.accountAddress!);
        transactions = await this.accountClient.getIncomingTransactions(
          param.transactionFilter,
          Searcher.BATCH_TRANSACTION_SIZE,
          address,
          fromTransactionId
        );
      } else {
        const publicAccount = await this.getPublicAccount(
          param.accountPrivateKey,
          param.accountPublicKey,
          param.accountAddress
        );
        
        transactions = await this.accountClient.getTransactions(
          param.transactionFilter,
          Searcher.BATCH_TRANSACTION_SIZE,
          publicAccount,
          fromTransactionId
        );
      }

      if (transactions && transactions.length > 0) {
        for (
          let index = 0;
          index < transactions.length && results.length < param.resultSize;
          index++
        ) {
          const transaction = transactions[index];
          const resultItem = await this.convertToResultItemIfMatchingCriteria(
            transaction,
            param
          );
          resultItem && results.push(resultItem);
          toTransactionId = transaction.transactionInfo!.id;
        }
      }

      if (
        transactions &&
        transactions.length === Searcher.BATCH_TRANSACTION_SIZE
      ) {
        // fetch some more
        fromTransactionId = transactions[transactions.length - 1]
          .transactionInfo!.id;
      } else {
        break;
      }
    }

    return new SearchResult(results, param.fromTransactionId, toTransactionId);
  }

  private async convertToResultItemIfMatchingCriteria(
    transaction,
    param: SearchParameter
  ): Promise<SearchResultItem | undefined> {
    if (transaction instanceof TransferTransaction) {
      try {
        const messagePayload = await this.retrieveProximaxMessagePayloadService.getMessagePayload(
          transaction as TransferTransaction,
          param.accountPrivateKey
        );

        // verify message payload is upload transaction by having the right json fields
        if (
          messagePayload &&
          messagePayload.version &&
          messagePayload.privacyType &&
          messagePayload.data &&
          messagePayload.data.timestamp &&
          messagePayload.data.dataHash
        ) {
          if (
            this.matchesSearchCriteria(
              messagePayload,
              param.nameFilter,
              param.descriptionFilter,
              param.metadataKeyFilter,
              param.metadataValueFilter,
              param.dataHash
            )
          ) {
            return new SearchResultItem(
              transaction.transactionInfo!.hash as string,
              messagePayload
            );
          }
        }
      } catch (err) {
        // skip transaction
      }
    }
    return undefined;
  }

  private matchesSearchCriteria(
    messagePayload: ProximaxMessagePayloadModel,
    nameFilter?: string,
    descriptionFilter?: string,
    metadataKeyFilter?: string,
    metadataValueFilter?: string,
    dataHashFilter?: string
  ): boolean {
    if (nameFilter) {
      if (
        !(
          messagePayload.data.name &&
          messagePayload.data.name.includes(nameFilter!)
        )
      ) {
        return false;
      }
    }
    if (descriptionFilter) {
      if (
        !(
          messagePayload.data.description &&
          messagePayload.data.description.includes(descriptionFilter!)
        )
      ) {
        return false;
      }
    }
    if (dataHashFilter) {
      if (
        !(
          messagePayload.data.dataHash &&
          messagePayload.data.dataHash === dataHashFilter!
        )
      ) {
        return false;
      }
    }
    if (metadataKeyFilter) {
      if (metadataValueFilter) {
        if (
          !(
            messagePayload.data.metadata &&
            messagePayload.data.metadata.get(metadataKeyFilter) ===
              metadataValueFilter
          )
        ) {
          return false;
        }
      } else {
        if (
          !(
            messagePayload.data.metadata &&
            messagePayload.data.metadata.get(metadataKeyFilter)
          )
        ) {
          return false;
        }
      }
    }
    return true;
  }

  private async getPublicAccount(
    accountPrivateKey?: string,
    accountPublicKey?: string,
    accountAddress?: string
  ): Promise<PublicAccount> {
    if (accountPrivateKey) {
      return Account.createFromPrivateKey(accountPrivateKey, this.networkType)
        .publicAccount;
    } else if (accountPublicKey) {
      return PublicAccount.createFromPublicKey(
        accountPublicKey,
        this.networkType
      );
    } else if (accountAddress) {
      return PublicAccount.createFromPublicKey(
        await this.accountClient.getPublicKey(accountAddress),
        this.networkType
      );
    } else {
      throw new Error(
        'accountPrivateKey, accountPublicKey or accountAddress must be provided'
      );
    }
  }
}
