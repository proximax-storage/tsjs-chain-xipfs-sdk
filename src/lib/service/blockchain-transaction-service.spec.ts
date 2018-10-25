import 'mocha';
import {
  BlockchainInfo,
  RecipientAccount,
  SampleTransactionHash,
  SenderAccount
} from '../config/testconfig';
import { BlockchainNetworkConnection } from '../connection/blockchain-network-connection';
import { BlockchainNetworkType } from '../model/blockchain/blockchain-network-type';
import { ProximaxDataModel } from '../model/proximax/data-model';
import { ProximaxMessagePayloadModel } from '../model/proximax/message-payload-model';

import { expect } from 'chai';
import { TransactionType } from 'proximax-nem2-sdk';
import { SchemaVersion } from '../config/constants';
// import { TransactionClient } from './client/transaction-client';
import { Protocol } from '../connection/protocol';
import { PrivacyType } from '../privacy/privacy-type';
import { BlockchainTransactionService } from './blockchain-transaction-service';

describe('BlockchainTransactionService', () => {
  const connection = new BlockchainNetworkConnection(
    BlockchainNetworkType.MIJIN_TEST,
    BlockchainInfo.apiHost,
    BlockchainInfo.apiPort,
    Protocol.HTTP
  );
  // const client = new TransactionClient(connection);

  const transactionService = new BlockchainTransactionService(connection);

  it('should create and announce transaction to blockchain', async () => {
    const model = new ProximaxDataModel(
      'Qmbd5jx8YF1QLhvwfLbCTWXGyZLyEJHrPbtbpRESvYs4FS',
      1
    );

    const payload = new ProximaxMessagePayloadModel(
      PrivacyType.PLAIN,
      model,
      SchemaVersion
    );

    const txnHash = await transactionService.createAndAnnounceTransaction(
      payload,
      SenderAccount.privateKey,
      1,
      false,
      undefined,
      RecipientAccount.publicKey,
      RecipientAccount.address
    );

    expect(txnHash).to.be.not.equal(undefined);
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

  // it('should get the recipient address from signer private key', () => {
  //   const address = transactionService.testGetRecipient(
  //     '',
  //     '',
  //     SenderAccount.privateKey
  //   );
  //   expect(address.plain()).to.be.equal(SenderAccount.address);
  // });
  //
  // it('should get the recipient address from recipient public key', () => {
  //   const address = transactionService.testGetRecipient(
  //     '',
  //     RecipientAccount.publicKey,
  //     ''
  //   );
  //   expect(address.plain()).to.be.equal(RecipientAccount.address);
  // });
  //
  // it('should get the recipient address from recipient address', () => {
  //   const address = transactionService.testGetRecipient(
  //     RecipientAccount.address,
  //     '',
  //     ''
  //   );
  //   expect(address.plain()).to.be.equal(RecipientAccount.address);
  // });
  //
  // it('should throw error if sender private key or recipient address or recipient public key is not provided', () => {
  //   expect(() => {
  //     transactionService.testGetRecipient('', '', '');
  //   }).to.throw;
  // });
});
