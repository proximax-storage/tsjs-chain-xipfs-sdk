import { expect } from 'chai';
import 'mocha';
// import {
//   Account,
//   Deadline,
//   PlainMessage,
//   TransferTransaction,
//   XEM
// } from 'tsjs-xpx-chain-sdk';
import {
  BlockchainInfo,
  // RecipientAccount,
  // GenerationHash,
  // SampleTransactionHash
  // SenderAccount
} from '../../../config/testconfig';

import { BlockchainNetworkConnection } from '../../../connection/blockchain-network-connection';
import { Protocol } from '../../../connection/protocol';
// import { Converter } from '../../../helper/converter';
import { BlockchainNetworkType } from '../../../model/blockchain/blockchain-network-type';
import { TransactionClient } from './transaction-client';

describe('TransactionClient', () => {
  const connection = new BlockchainNetworkConnection(
    BlockchainNetworkType.MIJIN_TEST,
    BlockchainInfo.apiHost,
    BlockchainInfo.apiPort,
    Protocol.HTTP
  );
  // const connection = new BlockchainNetworkConnection(BlockchainNetworkType.TEST_NET,'bcstage2.xpxsirius.io',3000,Protocol.HTTP);
  const client = new TransactionClient(connection);

  const transactionHash = '93531E3C043A2EC4484E16B41CD0E93880F31B2591FAFB0ABC2566A49AB9F5DF'; // SampleTransactionHash;
  const generationHash = 'B750FC8ADD9FAB8C71F0BB90B6409C66946844F07C5CADB51F27A9FAF219BFC7';
  // TODO revisit
  // it('should announce transaction to blockchain network', async () => {
  //   const message = 'Test announce transaction';
  //
  //   const networkType = Converter.getNemNetworkType(connection.networkType);
  //
  //   const signerAccount = Account.createFromPrivateKey(
  //     SenderAccount.privateKey,
  //     networkType
  //   );
  //
  //   const recipientAccount = Account.createFromPrivateKey(
  //     RecipientAccount.privateKey,
  //     networkType
  //   );
  //
  //   const transferTransaction = TransferTransaction.create(
  //     Deadline.create(1),
  //     recipientAccount.address,
  //     [XEM.createRelative(1)],
  //     PlainMessage.create(message),
  //     networkType
  //   );
  //
  //   const signedTransaction = signerAccount.sign(transferTransaction);
  //
  //   await client.announce(signedTransaction).subscribe(trxHash => {
  //     // console.log('Transaction hash ' + trxHash);
  //     expect(trxHash).to.be.not.equal(undefined);
  //   });
  // });

  it('should return transaction by transaction hash from blockchain', async () => {
    await client.getTransaction(transactionHash).subscribe(trx => {
      console.log('Transaction ' + JSON.stringify(trx));
      expect(trx.isConfirmed()).to.be.true;
    },err => {
      console.log(err)
    });
  });

  it('should return the generation hash from blockchain', async () => {
    await client.getNemesisBlockInfo().subscribe(blockInfo => {
      // console.log('Transaction ' + JSON.stringify(trx));
      // console.log(blockInfo);
      expect(blockInfo.generationHash).to.be.equal(generationHash);
    });
  });
});
