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
  Account,
  Address,
  Deadline,
  NetworkType,
  PlainMessage,
  TransactionType,
  TransferTransaction,
  XEM
} from 'nem2-sdk';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Converter } from '../helper/converter';
import { BlockchainNetworkConnection } from '../connection/blockchain-network-connection';
import { SecureMessage } from '../model/blockchain/secure-message';
import { ProximaxMessagePayloadModel } from '../model/proximax/message-payload-model';
import { TransactionClient } from './client/transaction-client';

/**
 * Class represents the blockchain transaction service
 */
export class BlockchainTransactionService {
  private connection: BlockchainNetworkConnection;
  private client: TransactionClient;
  private networkType: NetworkType;

  /**
   * Constructor
   * @param connection the blockchain network connection
   * @param client the transaction client
   */
  constructor(
    connection: BlockchainNetworkConnection,
   ) {
    this.connection = connection;
    this.client = new TransactionClient(connection);
    this.networkType = Converter.getNemNetworkType(this.connection.network);
  }

  /**
   * Creates and announces the mesage payload to blockchain
   * @param payload the payload
   * @param signerPrivateKey the signer private key
   * @param recipientPublicKey the recipient public key
   * @param recipientAddress the recipient address
   * @param transactionDeadline the transaction deadline
   * @param useBlockchainSecureMessage determine to use blockchain secure message
   */
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
      ? SecureMessage.encrypt(jsonPayload, signerPrivateKey, recipientPublicKey)
      : PlainMessage.create(jsonPayload);
    // const networkType = this.getNemNetworkType(this.connection.network);

    const signerAccount = Account.createFromPrivateKey(
      signerPrivateKey,
      this.networkType
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
      this.networkType
    );

    const signedTransaction = signerAccount.sign(transferTransaction);
    /*
    await this.client.waitForAnnouncedTransactionToBeUnconfirmed(
      recipient,
      signedTransaction.hash
    );*/

    return this.client.announce(signedTransaction).pipe(
      map(transactionHash => {
        return transactionHash;
      })
    );
  }

  /**
   * Gets the transferred transaction
   * @param transactionHash the transaction hash
   */
  public getTransferTransaction(
    transactionHash: string
  ): Observable<TransferTransaction> {
    if (!transactionHash) {
      throw new Error('transaction hash is required');
    }

    return this.client.getTransaction(transactionHash).pipe(
      map(transaction => {
        if (transaction.type === TransactionType.TRANSFER) {
          return transaction as TransferTransaction;
        } else {
          throw new Error('Expecting a transfer transaction');
        }
      })
    );
  }

  /**
   * Tests the get recipient method.
   * DO NOT USE THIS FUNCTION
   * @internal
   * @param recipientAddress the recipient address
   * @param recipientPublicKey The recipient public key
   * @param signerPrivateKey the signer private key
   */
  public testGetRecipient(
    recipientAddress: string,
    recipientPublicKey: string,
    signerPrivateKey: string
  ): Address {
    return this.getRecipient(
      recipientAddress,
      recipientPublicKey,
      signerPrivateKey
    );
  }

  /**
   *
   * @param recipientAddress the recipient address
   * @param recipientPublicKey The recipient public key
   * @param signerPrivateKey the signer private key
   */
  private getRecipient(
    recipientAddress: string,
    recipientPublicKey: string,
    signerPrivateKey: string
  ): Address {
    if (recipientPublicKey && recipientPublicKey.length > 0) {
      return Address.createFromPublicKey(recipientPublicKey, this.networkType);
    } else if (recipientAddress && recipientAddress.length > 0) {
      return Address.createFromRawAddress(recipientAddress);
    } else if (signerPrivateKey && signerPrivateKey.length > 0) {
      return Account.createFromPrivateKey(signerPrivateKey, this.networkType)
        .address;
    } else {
      throw new Error(
        'The recipient address, public key or signer private key is required'
      );
    }
  }
}
