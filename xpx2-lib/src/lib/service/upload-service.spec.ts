import 'mocha';
import {
  BlockchainHost,
  BlockchainWebsocket,
  IpfsMultAddress,
  IpfsPort,
  RecipientAccount,
  SchemaVersion,
  SenderAccount
} from '../config/config.spec';
import { BlockchainNetworkConnection } from '../connection/blockchain-network-connection';
import { IpfsConnection } from '../connection/ipfs-connection';
import { BlockchainNetworkType } from '../model/blockchain/blockchain-network-type';
import { PrivacyType } from '../model/privacy/privacy-type';
import { UploadParameter } from '../model/upload/upload-parameter';
import { UploadParameterData } from '../model/upload/upload-parameter-data';
import { BlockchainTransactionService } from './blockchain-transaction-service';
import { IpfsClient } from './client/ipfs-client';
import { TransactionClient } from './client/transaction-client';
import { ProximaxDataService } from './proximax-data-service';
import { UploadService } from './upload-service';

describe('UploadService', () => {
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

  const uploadService = new UploadService(
    blockchainTransactionService,
    proximaxDataService
  );

  it('should upload to ipfs storage and announce transaction to NEM', async () => {
    const byteStreams = Buffer.from(
      'ProximaX is an advanced extension of the Blockchain and Distributed Ledger Technology' +
        ' (DLT) with utility-rich services and protocols.'
    );

    const description = 'Proximax P2P storage';
    const contentType = 'text/plain';
    const metadata = new Map<any, any>();
    metadata.set('author', 'Proximax');
    const name = 'Proximax Upload TC 01';

    const options = {
      progress: (bytes: number) => {
        console.log(`Progress: ${bytes}`);
      }
    };

    const uploadParamData = new UploadParameterData(
      byteStreams,
      undefined,
      options,
      description,
      contentType,
      metadata,
      name
    );

    const uploadParam = new UploadParameter(
      uploadParamData,
      SenderAccount.privateKey,
      RecipientAccount.publicKey,
      RecipientAccount.address,
      1,
      false,
      PrivacyType.PLAIN,
      SchemaVersion
    );

    await uploadService.upload(uploadParam).subscribe(response => {
      console.log(response);
    });
  });
});
