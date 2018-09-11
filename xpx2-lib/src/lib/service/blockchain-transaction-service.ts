import {
  Account,
  Address,
  Deadline,
  NetworkType,
  PlainMessage,
  Transaction,
  TransactionType,
  TransferTransaction,
  XEM
} from 'nem2-sdk';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BlockchainNetworkConnection } from '../connection/blockchain-network-connection';
import { BlockchainNetworkType } from '../model/blockchain/blockchain-network-type';
import { SecureMessage } from '../model/privacy/secure-message';
import { ProximaxMessagePayloadModel } from '../model/proximax/message-payload';
import { TransactionClient } from './client/transaction-client';

export class BlockchainTransactionService {
  private connection: BlockchainNetworkConnection;
  private client: TransactionClient;
  private networkType: NetworkType;

  constructor(
    connection: BlockchainNetworkConnection,
    client: TransactionClient
  ) {
    this.connection = connection;
    this.client = client;
    this.networkType = this.getNemNetworkType(this.connection.network);
  }

  public createAndAnnounceTransaction(
    payload: ProximaxMessagePayloadModel,
    signerPrivateKey: string,
    recipientPublicKey: string,
    recipientAddress: string,
    transactionDeadline: number,
    useBlockchainSecureMessage: boolean
  ): Observable<string> {
    if (!signerPrivateKey) {
      throw new Error('signer private key is required');
    }

    if (!payload) {
      throw new Error('payload is required');
    }

    const jsonPayload = JSON.stringify(payload);
    const message = useBlockchainSecureMessage
      ? SecureMessage.create(jsonPayload)
      : PlainMessage.create(jsonPayload);
    const networkType = this.getNemNetworkType(this.connection.network);

    const signerAccount = Account.createFromPrivateKey(
      signerPrivateKey,
      networkType
    );

    const recipient = this.getRecipient(
      recipientAddress,
      recipientPublicKey,
      signerPrivateKey
    );

    // TODO: Refactor when levy implement in blockchain
    const mosaic = XEM.createRelative(1);

    const transferTransaction = TransferTransaction.create(
      Deadline.create(transactionDeadline),
      recipient,
      [mosaic],
      message,
      networkType
    );

    const signedTransaction = signerAccount.sign(transferTransaction);

    return this.client.announce(signedTransaction).pipe(
      map(_ => {
        // TODO: validate transaction announce correctly

        return signedTransaction.hash;
      })
    );
  }

  public getTransferTransaction(transactionHash: string): Observable<Transaction> {
    if (!transactionHash) {
      throw new Error('transaction hash is required');
    }

    return this.client.getTransaction(transactionHash).pipe(
      map(transaction => {
        if (transaction.type === TransactionType.TRANSFER) {
          return transaction;
        } else {
          throw new Error('Expecting a transfer transaction');
        }
      })
    );
  }

  private getRecipient(
    recipientAddress: string,
    recipientPublicKey: string,
    signerPrivateKey: string
  ): Address {
    if (recipientPublicKey) {
      return Address.createFromPublicKey(recipientPublicKey, this.networkType);
    } else if (recipientAddress) {
      return Address.createFromRawAddress(recipientAddress);
    } else {
      return Account.createFromPrivateKey(signerPrivateKey, this.networkType)
        .address;
    }
  }

  private getNemNetworkType(
    blockchainNetworkType: BlockchainNetworkType
  ): NetworkType {
    switch (blockchainNetworkType) {
      case BlockchainNetworkType.MAIN_NET:
        return NetworkType.MAIN_NET;
      case BlockchainNetworkType.MIJIN_MAIN:
        return NetworkType.MIJIN;
      case BlockchainNetworkType.TEST_NET:
        return NetworkType.TEST_NET;
      case BlockchainNetworkType.MIJIN_TEST:
        return NetworkType.MIJIN_TEST;
      default:
        return NetworkType.MIJIN_TEST;
    }
  }
}
