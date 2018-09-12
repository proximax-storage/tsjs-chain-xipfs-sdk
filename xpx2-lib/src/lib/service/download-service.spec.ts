import 'mocha';
import { StringDecoder } from 'string_decoder';
import {
  BlockchainHost,
  BlockchainWebsocket,
  IpfsMultAddress,
  IpfsPort,
  RecipientAccount
} from '../config/config.spec';
import { BlockchainNetworkConnection } from '../model/blockchain/blockchain-network-connection';
import { BlockchainNetworkType } from '../model/blockchain/blockchain-network-type';
import { DownloadParameter } from '../model/download/download-parameter';
import { IpfsConnection } from '../model/ipfs/ipfs-connection';
import { PrivacyType } from '../model/privacy/privacy-type';
import { BlockchainTransactionService } from './blockchain-transaction-service';
import { IpfsClient } from './client/ipfs-client';
import { TransactionClient } from './client/transaction-client';
import { DownloadService } from './download-service';
import { ProximaxDataService } from './proximax-data-service';

describe('DownloadService', () => {
  const ipfsConnection = new IpfsConnection(IpfsMultAddress, IpfsPort);
  const blockchainNetworkConnection = new BlockchainNetworkConnection(
    BlockchainNetworkType.MIJIN_TEST,
    BlockchainHost,
    BlockchainWebsocket
  );

  const ipfsClient = new IpfsClient(ipfsConnection);
  const transactionClient = new TransactionClient(blockchainNetworkConnection);

  const blockchainTransactionService = new BlockchainTransactionService(
    blockchainNetworkConnection,
    transactionClient
  );
  const proximaxDataService = new ProximaxDataService(ipfsClient);

  const downloadService = new DownloadService(
    blockchainTransactionService,
    proximaxDataService
  );

  it('should download data by transaction hash', async () => {
    const transactionHash =
      'F6F901704BB271F7CE2E4FD6BC38A9715EC3752000AEDF0AA67CE38BD07EC42E';
    const privacyStrategy = PrivacyType.PLAIN;
    const downloadParam = new DownloadParameter(
      transactionHash,
      RecipientAccount.privateKey,
      privacyStrategy
    );

    await downloadService.download(downloadParam).subscribe(downloadResult => {
      const data = downloadResult.data.data;
      // console.log('-------');
      // console.log(data);
      const decoder = new StringDecoder('utf8');
      const message = decoder.write(data);
      console.log('Data from download result' + message);
    });
  });
});
