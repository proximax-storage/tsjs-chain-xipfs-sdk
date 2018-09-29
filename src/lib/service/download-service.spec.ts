import { expect } from 'chai';
import 'mocha';
import {
  BlockchainInfo,
  IpfsInfo,
  RecipientAccount
} from '../config/config.spec';
import { BlockchainNetworkConnection } from '../connection/blockchain-network-connection';
import { IpfsConnection } from '../connection/ipfs-connection';
import { Protocol } from '../connection/protocol';
import { DownloadParameter } from '../download/download-parameter';
import { BlockchainNetworkType } from '../model/blockchain/blockchain-network-type';
import { PlainPrivacyStrategy } from '../privacy/plain-privacy';
import { BlockchainTransactionService } from './blockchain-transaction-service';
import { IpfsClient } from './client/ipfs-client';
// import { TransactionClient } from './client/transaction-client';
import { DownloadService } from './download-service';
import { ProximaxDataService } from './proximax-data-service';

describe('DownloadService', () => {
  const ipfsConnection = new IpfsConnection(
    IpfsInfo.multiaddress,
    IpfsInfo.port
  );
  const blockchainNetworkConnection = new BlockchainNetworkConnection(
    BlockchainNetworkType.MIJIN_TEST,
    BlockchainInfo.apiHost,
    BlockchainInfo.apiPort,
    Protocol.HTTP
  );

  const ipfsClient = new IpfsClient(ipfsConnection);
  // const transactionClient = new TransactionClient(blockchainNetworkConnection);

  const blockchainTransactionService = new BlockchainTransactionService(
    blockchainNetworkConnection
  );
  const proximaxDataService = new ProximaxDataService(ipfsClient);

  const downloadService = new DownloadService(
    blockchainTransactionService,
    proximaxDataService
  );

  it('should download data by transaction hash', async () => {
    const transactionHash =
      '8A201CBA4929D1CC9EA37597C8F5CCE361531F2375E0AF2A287F7D78FEC57013';
    const expectedDataHash = 'QmQP3SMR7fZqfAxm442NErqwNuchQTf2aVwqTqj2rkCEaB';

    const expectedText =
      'ProximaX is an advanced extension of the Blockchain and Distributed Ledger Technology' +
      ' (DLT) with utility-rich services and protocols.';

    const downloadParam = new DownloadParameter(
      transactionHash,
      RecipientAccount.privateKey,
      PlainPrivacyStrategy.create()
    );

    await downloadService.download(downloadParam).subscribe(downloadResult => {
      // console.log(downloadResult);
      // console.log(downloadResult.data!.bytes.toString('utf8'));
      expect(downloadResult.data!.dataHash).to.be.equal(expectedDataHash);
      expect(downloadResult.data!.bytes.toString('utf8')).to.be.equal(
        expectedText
      );
    });
  });
});
