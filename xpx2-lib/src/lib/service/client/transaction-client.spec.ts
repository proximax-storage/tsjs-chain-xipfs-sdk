import { expect } from 'chai';
import 'mocha';
import {
  Account,
  Deadline,
  PlainMessage,
  TransferTransaction,
  XEM
} from 'nem2-sdk';
import { switchMap } from 'rxjs/operators';
import {
  BlockchainInfo,
  RecipientAccount,
  SenderAccount
} from '../../config/config.spec';
import { Converter } from '../../helper/converter';
import { BlockchainNetworkConnection } from '../../model/blockchain/blockchain-network-connection';
import { BlockchainNetworkType } from '../../model/blockchain/blockchain-network-type';
import { TransactionClient } from './transaction-client';

describe('TransactionClient', () => {
  const connection = new BlockchainNetworkConnection(
    BlockchainNetworkType.MIJIN_TEST,
    BlockchainInfo.endpointUrl,
    BlockchainInfo.socketUrl
  );
  const client = new TransactionClient(connection);

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

    await client.announce(signedTransaction).subscribe(transactionHash => {
      console.log(transactionHash);
      expect(transactionHash).to.be.not.undefined(transactionHash);
    });
  });

  it('should get transaction from blockchain network after announcing', async () => {
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

    await client
      .announce(signedTransaction)
      .pipe(
        switchMap(transactionHash => {
          console.log(transactionHash);
          return client.getTransaction(transactionHash);
        })
      )
      .subscribe(transaction => {
        console.log(transaction as TransferTransaction);
      });
  });
});
