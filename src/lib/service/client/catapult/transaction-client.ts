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
import { merge, Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import {
  Address,
  BlockHttp,
  BlockInfo,
  Listener,
  SignedTransaction,
  Transaction,
  TransactionHttp
} from 'tsjs-xpx-chain-sdk';
import { BlockchainNetworkConnection } from '../../../connection/blockchain-network-connection';
import { PromiseHelper } from '../../../helper/promise-helper';

/**
 * Class represents the blockchain transaction client
 */
export class TransactionClient {
  public static readonly StatusForSuccessfulUnconfirmedTransaction = 'SUCCESS';

  private readonly transactionHttp: TransactionHttp;
  private readonly blockHttp: BlockHttp;
  private readonly blockchainNetworkRestApiUrl: string;

  /**
   * Construct the class with BlockchainNetworkConnection
   *
   * @param connection the blockchain network connection
   */
  constructor(public readonly connection: BlockchainNetworkConnection) {
    this.transactionHttp = new TransactionHttp(connection.getApiUrl());
    this.blockHttp = new BlockHttp(connection.getApiUrl());
    this.blockchainNetworkRestApiUrl = connection
      .getApiUrl()
      .replace('https://', 'wss://')
      .replace('http://', 'ws://');
  }

  /**
   * Synchronously announce a signed transaction to blockchain
   * <br>
   * <br>
   * This method is equivalent to calling `PUT /transaction`
   *
   * @param signedTransaction the signed transaction
   * @param address the signer's address
   * @return the transaction announce result
   */
  public async announce(
    signedTransaction: SignedTransaction,
    address: Address
  ): Promise<string> {
    if (!signedTransaction) {
      throw new Error('signed transaction is required');
    }
    if (!address) {
      throw new Error('address is required');
    }

    const txnStatus = await this.announceAndWaitForStatus(
      signedTransaction,
      address
    );

    if (
      txnStatus !== TransactionClient.StatusForSuccessfulUnconfirmedTransaction
    ) {
      throw new Error('Failed to announce transaction with status ' + txnStatus);
    }

    return txnStatus;
  }

  /**
   * Retrieves a transaction from blockchain
   * <br>
   * <br>
   * This method is equivalent to calling `GET /transaction/{transactionHash}`
   *
   * @param transactionHash the signed transaction
   * @return the transaction announce response
   */
  public getTransaction(transactionHash: string): Observable<Transaction> {
    if (!transactionHash) {
      throw new Error('transaction hash is required');
    }
  
    return this.transactionHttp.getTransaction(transactionHash);
  }

  /**
   * Gets the nemesis block info
   * @return the generation hash
   */
  public getNemesisBlockInfo(): Observable<BlockInfo> {
    return this.blockHttp.getBlockByHeight(1);
  }

  private async announceAndWaitForStatus(
    signedTransaction: SignedTransaction,
    address: Address
  ): Promise<string> {
    const listener = this.getListener();

    try {
      await listener.open();

      const failedTransactionStatus$ = this.getAddedFailedTransactionStatus(
        address,
        signedTransaction.hash,
        listener
      );
      const unconfirmedTransactionStatus$ = this.getAddedUnconfirmedTransactionStatus(
        address,
        signedTransaction.hash,
        listener
      );

      const txnStatusPromise = merge(
        failedTransactionStatus$,
        unconfirmedTransactionStatus$
      )
        .pipe(take(1))
        .toPromise();

      this.transactionHttp.announce(signedTransaction);
       
      const txnStatus = await PromiseHelper.timeout(
        txnStatusPromise,
        'announce transaction',
        60000
      );

      return txnStatus;
    } catch (err) {
      throw new Error('Failed to announce transaction ' + JSON.stringify(err));
    } finally {
      await this.closeListener(listener);
    }
  }

  private getAddedFailedTransactionStatus(
    address: Address,
    transactionHash: string,
    listener: Listener
  ): Observable<string> {
    return listener.status(address).pipe(
      filter(transaction => transaction.hash === transactionHash),
      map(transaction => transaction.status)
    );
  }

  private getAddedUnconfirmedTransactionStatus(
    address: Address,
    transactionHash: string,
    listener: Listener
  ): Observable<string> {
    return listener.unconfirmedAdded(address).pipe(
      filter(
        unconfirmedTrx =>
          unconfirmedTrx.transactionInfo!.hash === transactionHash
      ),
      map(_ => TransactionClient.StatusForSuccessfulUnconfirmedTransaction)
    );
  }

  private getListener(): Listener {
    try {
      return new Listener(
        this.blockchainNetworkRestApiUrl,
        typeof window !== 'undefined' && (window as any).WebSocket
      );
    } catch (err) {
      throw new Error('Unable to construct listener ' + err);
    }
  }

  private closeListener(listener: Listener) {
    try {
      listener.close();
    } catch (err) {
      throw new Error('Failed to close listener ' + err);
    }
  }
}
