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

import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import {
  Account,
  Address,
  Deadline,
  Message,
  Mosaic,
  MosaicId,
  NetworkType,
  SignSchema,
  TransactionType,
  TransferTransaction,
  UInt64
} from 'tsjs-xpx-chain-sdk';
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
   * @param transactionMosaics         the mosaics to use on upload transaction
   * @param transactionDeadline        the transaction deadline in hours
   * @param useBlockchainSecureMessage the flag to indicate if secure message will be created
   * @return the transaction hash
   */
  public async createAndAnnounceTransaction(
    payload: ProximaxMessagePayloadModel,
    signerPrivateKey: string,
    transactionDeadline: number,
    useBlockchainSecureMessage: boolean,
    transactionMosaics?: Mosaic[],
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
    console.log(message);
    const recipient = this.getRecipient(
      signerPrivateKey,
      recipientAddress,
      recipientPublicKey
    );
    const transferTransaction = this.createTransaction(
      recipient,
      transactionDeadline,
      message,
      transactionMosaics
    );
    const signerAccount = Account.createFromPrivateKey(
      signerPrivateKey,
      this.networkType
    );

    const generationHash = (await this.transactionClient.getNemesisBlockInfo().pipe(take(1)).toPromise()).generationHash;
  
    const signedTransaction = signerAccount.sign(transferTransaction,generationHash,SignSchema.SHA3);
    
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
    message: Message,
    transactionMosaicsParam?: Mosaic[]
  ): TransferTransaction {
    const mosaic =
      transactionMosaicsParam === undefined
        ? [new Mosaic(new MosaicId('0dc67fbe1cad29e3'), UInt64.fromUint(0))]
        : transactionMosaicsParam;
    return TransferTransaction.create(
      Deadline.create(transactionDeadline),
      recipientAddress,
      mosaic,
      message,
      this.networkType
    );
  }
}
