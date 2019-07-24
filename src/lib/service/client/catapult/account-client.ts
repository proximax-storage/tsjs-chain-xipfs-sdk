import {
  AccountHttp,
  Address,
  PublicAccount,
  QueryParams,
  Transaction
} from 'tsjs-xpx-chain-sdk';
import { BlockchainNetworkConnection } from '../../../connection/blockchain-network-connection';
import { TransactionFilter } from '../../../model/blockchain/transaction-filter';

/**
 * The client class that directly interface with the blockchain's transaction APIs
 */
export class AccountClient {
  /**
   * The public key constant when it is not yet used to send transaction on catapult.
   */
  public static readonly PUBLIC_KEY_NOT_FOUND =
    '0000000000000000000000000000000000000000000000000000000000000000';

  private readonly accountHttp: AccountHttp;

  /**
   * Create instance of AccountClient
   * @param blockchainNetworkConnection the blockchain connection
   * @throws MalformedURLException exception when invalid blockchain URl
   */
  public constructor(
    public readonly blockchainNetworkConnection: BlockchainNetworkConnection
  ) {
    if (blockchainNetworkConnection === null) {
      throw new Error('blockchain network connection is required');
    }

    this.accountHttp = new AccountHttp(blockchainNetworkConnection.getApiUrl());
  }

  public async getPublicKey(address: string): Promise<string> {
    if (address === null || address.length <= 0) {
      throw new Error('address is required');
    }

    const accountInfo = await this.accountHttp
      .getAccountInfo(Address.createFromRawAddress(address))
      .toPromise();
    if (accountInfo.publicKey === AccountClient.PUBLIC_KEY_NOT_FOUND) {
      throw new Error(`Address ${address} has no public key yet on blockchain`);
    }

    return accountInfo.publicKey;
  }

  public async getTransactions(
    transactionFilter: TransactionFilter,
    resultSize: number,
    publicAccount: PublicAccount,
    fromTransactionId?: string
  ): Promise<Transaction[]> {
    if (!transactionFilter) {
      throw new Error('transactionFilter is required');
    }

    const queryParams = new QueryParams(resultSize, fromTransactionId);

    if (transactionFilter === TransactionFilter.ALL) {
      return this.accountHttp
        .transactions(publicAccount, queryParams)
        .toPromise();
    } else if (transactionFilter === TransactionFilter.OUTGOING) {
      return this.accountHttp
        .outgoingTransactions(publicAccount, queryParams)
        .toPromise();
    } else if (transactionFilter === TransactionFilter.INCOMING) {
      return this.accountHttp
        .incomingTransactions(publicAccount, queryParams)
        .toPromise();
    } else {
      throw new Error(`Unknown transactionFilter ${transactionFilter}`);
    }
  }
}
