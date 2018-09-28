import { expect } from 'chai';
import 'mocha';
import {
  Account,
  Deadline,
  PlainMessage,
  TransferTransaction,
  XEM
} from 'nem2-sdk';
import {
  BlockchainInfo,
  RecipientAccount,
  SampleTransactionHash,
  SenderAccount
} from '../../config/config.spec';
import { BlockchainNetworkConnection } from '../../connection/blockchain-network-connection';
import { Protocol } from '../../connection/protocol';
import { Converter } from '../../helper/converter';
import { BlockchainNetworkType } from '../../model/blockchain/blockchain-network-type';
import { TransactionClient } from './transaction-client';

describe('TransactionClient', () => {
  const connection = new BlockchainNetworkConnection(
    BlockchainNetworkType.MIJIN_TEST,
    BlockchainInfo.apiHost,
    BlockchainInfo.apiPort,
    Protocol.HTTP
  );
  const client = new TransactionClient(connection);

  const transactionHash = SampleTransactionHash;

  it('should announce transaction to blockchain network', async () => {
    const message = 'Test announce transaction';

    const networkType = Converter.getNemNetworkType(connection.network);

    const signerAccount = Account.createFromPrivateKey(
      SenderAccount.privateKey,
      networkType
    );

    const recipientAccount = Account.createFromPrivateKey(
      RecipientAccount.privateKey,
      networkType
    );

    const transferTransaction = TransferTransaction.create(
      Deadline.create(1),
      recipientAccount.address,
      [XEM.createRelative(1)],
      PlainMessage.create(message),
      networkType
    );

    const signedTransaction = signerAccount.sign(transferTransaction);

    await client.announce(signedTransaction).subscribe(trxHash => {
      // console.log(trxHash);
      expect(trxHash).to.be.not.equal(undefined);
    });
  });

  it('should return transaction by transaction hash from blockchain', async () => {
    await client.getTransaction(transactionHash).subscribe(trx => {
      // console.log(response);
      expect(trx.isConfirmed()).to.be.true;
    });
  });
});
