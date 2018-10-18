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
  Mosaic,
  MosaicId,
  NetworkType,
  PlainMessage,
  SecureMessage,
  TransactionType,
  TransferTransaction,
  UInt64
} from 'proximax-nem2-sdk';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BlockchainNetworkConnection } from '../connection/blockchain-network-connection';
import { Converter } from '../helper/converter';
import { ProximaxMessagePayloadModel } from '../model/proximax/message-payload-model';
import { TransactionClient } from './client/catapult/transaction-client';

/**
 * The service class responsible for handling tasks that work with blockchain transactions
 */
export class BlockchainTransactionService {
  private readonly transactionClient: TransactionClient;
  private readonly networkType: NetworkType;

  /**
   * Construct service class
   *
   * @param connection the config class to connect to blockchain network
   */
  constructor(public readonly connection: BlockchainNetworkConnection) {
    this.transactionClient = new TransactionClient(connection);
    this.networkType = Converter.getNemNetworkType(this.connection.networkType);
  }

  /**
   * Create and announce a blockchain transaction
   *
   * @param payload             the message payload
   * @param signerPrivateKey           the signer's private key for the transaction
   * @param recipientPublicKey         the recipient's public key for the transaction (if different from signer)
   * @param recipientAddress           the recipient's address for the transaction (if different from signer)
   * @param transactionDeadline        the transaction deadline in hours
   * @param useBlockchainSecureMessage the flag to indicate if secure message will be created
   * @return the transaction hash
   */
  public async createAndAnnounceTransaction(
    payload: ProximaxMessagePayloadModel,
    signerPrivateKey: string,
    recipientPublicKey: string,
    recipientAddress: string,
    transactionDeadline: number,
    useBlockchainSecureMessage: boolean
  ): Promise<string> {
    if (!signerPrivateKey) {
      throw new Error('signer private key is required');
    }
    if (!payload) {
      throw new Error('payload is required');
    }

    const jsonPayload = JSON.stringify(payload);
    console.log(' recipientPublicKey ' + recipientPublicKey);
    console.log(' signerPrivateKey ' + signerPrivateKey);
    const message = useBlockchainSecureMessage
      ? SecureMessage.create(jsonPayload, recipientPublicKey, signerPrivateKey)
      : PlainMessage.create(jsonPayload);
    console.log(message);
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

    const mosaic = new Mosaic(new MosaicId('prx:xpx'), UInt64.fromUint(1));
    console.log('deadline ' + transactionDeadline);

    const transferTransaction = TransferTransaction.create(
      Deadline.create(transactionDeadline),
      recipient,
      [mosaic],
      message,
      this.networkType
    );

    console.log('Tranfer transaction ..');
    console.log(transferTransaction.message);

    const signedTransaction = signerAccount.sign(transferTransaction);

    await this.transactionClient.announce(
      signedTransaction,
      signerAccount.address
    );

    return signedTransaction.hash;
  }

  /**
   * Retrieves a transfer transaction
   *
   * @param transactionHash the transfer transaction hash
   * @return the transfer transaction
   */
  public getTransferTransaction(
    transactionHash: string
  ): Observable<TransferTransaction> {
    if (!transactionHash) {
      throw new Error('transaction hash is required');
    }

    return this.transactionClient.getTransaction(transactionHash).pipe(
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
