import { expect } from 'chai';
import 'mocha';
import {
  BlockchainInfo,
  IpfsInfo,
  RecipientAccount,
  SchemaVersion,
  SenderAccount
} from '../config/config.spec';
import { BlockchainNetworkConnection } from '../model/blockchain/blockchain-network-connection';
import { BlockchainNetworkType } from '../model/blockchain/blockchain-network-type';
import { IpfsConnection } from '../model/ipfs/ipfs-connection';
import { UploadParameter } from '../model/upload/upload-parameter';
import { UploadParameterData } from '../model/upload/upload-parameter-data';
import { PrivacyType } from '../privacy/privacy-type';
import { BlockchainTransactionService } from './blockchain-transaction-service';
import { IpfsClient } from './client/ipfs-client';
import { TransactionClient } from './client/transaction-client';
import { ProximaxDataService } from './proximax-data-service';
import { UploadService } from './upload-service';

describe('UploadService', () => {
  const ipfsConnection = new IpfsConnection(
    IpfsInfo.multiaddress,
    IpfsInfo.port
  );

  const blockchainNetworkConnection = new BlockchainNetworkConnection(
    BlockchainNetworkType.MIJIN_TEST,
    BlockchainInfo.endpointUrl,
    BlockchainInfo.socketUrl
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

    const expectedHash = 'QmQP3SMR7fZqfAxm442NErqwNuchQTf2aVwqTqj2rkCEaB';
    const description = 'Proximax P2P storage';
    const contentType = 'text/plain';
    const metadata = new Map<any, any>();
    metadata.set('author', 'Proximax');
    const name = 'Proximax Upload TC 01';

    const options = {
      progress: (bytes: number) => {
        console.log(`Upload Progress: ${bytes}`);
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
      PrivacyType.PLAIN,
      SchemaVersion,
      RecipientAccount.publicKey,
      RecipientAccount.address,
      1,
      false,
      true
    );

    await uploadService.upload(uploadParam).subscribe(uploadResult => {
      // console.log(response);
      expect(uploadResult.transactionHash).to.be.not.equal(undefined);
      expect(uploadResult.data!.dataHash).to.be.equal(expectedHash);
    });
  });
});