import {
  Address,
  Listener,
  SignedTransaction,
  Transaction,
  TransactionAnnounceResponse,
  TransactionHttp
} from 'nem2-sdk';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { BlockchainNetworkConnection } from '../../connection/blockchain-network-connection';

export class TransactionClient {
  private transactionHttp: TransactionHttp;
  // private listener: Listener;

  constructor(connection: BlockchainNetworkConnection) {
    this.transactionHttp = new TransactionHttp(connection.endpointUrl);
    // this.listener = new Listener(connection.socketUrl);
  }

  public announce(
    signedTransaction: SignedTransaction
  ): Observable<TransactionAnnounceResponse> {
    if (!signedTransaction) {
      throw new Error('signed transaction is required');
    }

    return this.transactionHttp.announce(signedTransaction);
  }

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
  ) {
    return listener.status(address).pipe(
      filter(transaction => transaction.hash === transactionHash),
      map(transaction => transaction.status)
    );
  }
}
