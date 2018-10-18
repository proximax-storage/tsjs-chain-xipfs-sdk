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

import { ChronoUnit } from 'js-joda';
import {
  Account,
  Address,
  Deadline,
  Message,
  Mosaic,
  MosaicId,
  NetworkType,
  TransactionType,
  TransferTransaction,
  UInt64
} from 'proximax-nem2-sdk';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BlockchainNetworkConnection } from '../connection/blockchain-network-connection';
import { Converter } from '../helper/converter';
import { ProximaxMessagePayloadModel } from '../model/proximax/message-payload-model';
import { BlockchainMessageService } from './blockchain-message-service';
import { TransactionClient } from './client/catapult/transaction-client';

/**
 * The service class responsible for handling tasks that work with blockchain transactions
 */
export class BlockchainTransactionService {
  private readonly blockchainMessageService: BlockchainMessageService;
  private readonly transactionClient: TransactionClient;
  private readonly networkType: NetworkType;

  /**
   * Construct service class
   *
   * @param connection the config class to connect to blockchain network
   */
  constructor(public readonly connection: BlockchainNetworkConnection) {
    this.blockchainMessageService = new BlockchainMessageService(connection);
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
    transactionDeadline: number,
    useBlockchainSecureMessage: boolean,
    recipientPublicKey?: string,
    recipientAddress?: string
  ): Promise<string> {
    if (!signerPrivateKey) {
      throw new Error('signer private key is required');
    }
    if (!payload) {
      throw new Error('payload is required');
    }

    const message = await this.blockchainMessageService.createMessage(
      payload,
      signerPrivateKey,
      useBlockchainSecureMessage,
      recipientPublicKey,
      recipientAddress
    );
    const recipient = this.getRecipient(
      signerPrivateKey,
      recipientAddress,
      recipientPublicKey
    );
    const transferTransaction = this.createTransaction(
      recipient,
      transactionDeadline,
      message
    );
    const signerAccount = Account.createFromPrivateKey(
      signerPrivateKey,
      this.networkType
    );
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

  private getRecipient(
    signerPrivateKey: string,
    recipientAddress?: string,
    recipientPublicKey?: string
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

  private createTransaction(
    recipientAddress: Address,
    transactionDeadline: number,
    message: Message
  ): TransferTransaction {
    return TransferTransaction.create(
      Deadline.create(transactionDeadline, ChronoUnit.HOURS),
      recipientAddress,
      [new Mosaic(new MosaicId('prx:xpx'), UInt64.fromUint(1))],
      message,
      this.networkType
    );
  }
}
