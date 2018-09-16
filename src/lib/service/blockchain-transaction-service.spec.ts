import 'mocha';
import {
  BlockchainInfo,
  RecipientAccount,
  SampleTransactionHash,
  SchemaVersion,
  SenderAccount
} from '../config/config.spec';
import { BlockchainNetworkConnection } from '../model/blockchain/blockchain-network-connection';
import { BlockchainNetworkType } from '../model/blockchain/blockchain-network-type';
import { ProximaxDataModel } from '../model/proximax/data-model';
import { ProximaxMessagePayloadModel } from '../model/proximax/message-payload-model';

import { expect } from 'chai';
import { TransactionType } from 'nem2-sdk';
import { PrivacyType } from '../privacy/privacy-type';
import { BlockchainTransactionService } from './blockchain-transaction-service';
import { TransactionClient } from './client/transaction-client';

describe('BlockchainTransactionService', () => {
  const connection = new BlockchainNetworkConnection(
    BlockchainNetworkType.MIJIN_TEST,
    BlockchainInfo.endpointUrl,
    BlockchainInfo.socketUrl
  );
  const client = new TransactionClient(connection);

  const transactionService = new BlockchainTransactionService(
    connection,
    client
  );

  it('should create and announce transaction to blockchain', async () => {
    const model = new ProximaxDataModel(
      'Qmbd5jx8YF1QLhvwfLbCTWXGyZLyEJHrPbtbpRESvYs4FS'
    );

    const payload = new ProximaxMessagePayloadModel(
      PrivacyType.PLAIN,
      model,
      SchemaVersion
    );

    await transactionService
      .createAndAnnounceTransaction(
        payload,
        SenderAccount.privateKey,
        RecipientAccount.publicKey,
        RecipientAccount.address,
        1,
        false
      )
      .subscribe(trx => {
        // console.log('Announced transaction ' + response);
        expect(trx).to.be.not.equal(undefined);
      });
  });

  it('should return transfer transaction', async () => {
    await transactionService
      .getTransferTransaction(SampleTransactionHash)
      .subscribe(transferedTransaction => {
        // console.log(transferedTransaction);
        expect(transferedTransaction.type === TransactionType.TRANSFER).to.be
          .true;
      });
  });

  it('should get the recipient address from signer private key', () => {
    const address = transactionService.testGetRecipient(
      '',
      '',
      SenderAccount.privateKey
    );
    expect(address.plain()).to.be.equal(SenderAccount.address);
  });

  it('should get the recipient address from recipient public key', () => {
    const address = transactionService.testGetRecipient(
      '',
      RecipientAccount.publicKey,
      ''
    );
    expect(address.plain()).to.be.equal(RecipientAccount.address);
  });

  it('should get the recipient address from recipient address', () => {
    const address = transactionService.testGetRecipient(
      RecipientAccount.address,
      '',
      ''
    );
    expect(address.plain()).to.be.equal(RecipientAccount.address);
  });

  it('should throw error if sender private key or recipient address or recipient public key is not provided', () => {
    expect(() => {
      transactionService.testGetRecipient('', '', '');
    }).to.throw;
  });
});
