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
import {
  Address,
  Listener,
  SignedTransaction,
  Transaction,
  TransactionHttp
} from 'nem2-sdk';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { BlockchainNetworkConnection } from '../../model/blockchain/blockchain-network-connection';

/**
 * Class represents the blockchain transaction client
 */
export class TransactionClient {
  private transactionHttp: TransactionHttp;
  // private listener: Listener;

  /**
   * Constructor
   * @param connection the blockchain network connection
   */
  constructor(connection: BlockchainNetworkConnection) {
    this.transactionHttp = new TransactionHttp(connection.endpointUrl);
    // this.listener = new Listener(connection.socketUrl);
  }

  /**
   * Announces signed transaction to blockchain network
   * @param signedTransaction The signed transaction
   */
  public announce(signedTransaction: SignedTransaction): Observable<string> {
    if (!signedTransaction) {
      throw new Error('signed transaction is required');
    }

    return this.transactionHttp.announce(signedTransaction).pipe(
      map(_ => {
        return signedTransaction.hash;
      })
    );
  }

  /**
   * Gets the transaction based on the transaction hash
   * @param transactionHash the transaction hash
   */
  public getTransaction(transactionHash: string): Observable<Transaction> {
    if (!transactionHash) {
      throw new Error('transaction hash is required');
    }

    return this.transactionHttp.getTransaction(transactionHash);
  }

  public getAddedFailedTransactionStatus(
    address: Address,
    transactionHash: string,
    listener: Listener
  ): Observable<string> {
    return listener.status(address).pipe(
      filter(transaction => transaction.hash === transactionHash),
      map(transaction => transaction.status)
    );
  }

  public getAddedUnconfirmedTransactionStatus(
    address: Address,
    transactionHash: string,
    listener: Listener
  ): Observable<string> {
    return listener.unconfirmedAdded(address).pipe(
      filter(
        unconfirmedTrx =>
          unconfirmedTrx.transactionInfo!.hash === transactionHash
      ),
      map(_ => 'Success')
    );
  }
}
