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
    BlockchainNetworkType.TEST_NET,
    BlockchainInfo.apiHost,
    BlockchainInfo.apiPort,
    Protocol.HTTPS
  );
  console.log(connection);

  // const connection = new BlockchainNetworkConnection(BlockchainNetworkType.TEST_NET,'bcstage2.xpxsirius.io',3000,Protocol.HTTP);
  const client = new TransactionClient(connection);

  const transactionHash = '085B3C760E02E1C761E4A58C04EE7B1AFAE543F4F106DDE6EE6E146A63E5EB4B'; // SampleTransactionHash;
  const generationHash = '3D9507C8038633C0EB2658704A5E7BC983E4327A99AC14D032D67F5AACBCCF6A';
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
