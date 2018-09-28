import { expect } from 'chai';
import 'mocha';
import {
  BlockchainInfo,
  IpfsInfo,
  RecipientAccount,
  SchemaVersion,
  SenderAccount
} from '../config/config.spec';
import { BlockchainNetworkConnection } from '../connection/blockchain-network-connection';
import { IpfsConnection } from '../connection/ipfs-connection';
import { Protocol } from '../connection/protocol';
import { BlockchainNetworkType } from '../model/blockchain/blockchain-network-type';
import { PrivacyType } from '../privacy/privacy-type';
import { UploadParameter } from '../upload/upload-parameter';
import { UploadParameterData } from '../upload/upload-parameter-data';
import { BlockchainTransactionService } from './blockchain-transaction-service';
import { IpfsClient } from './client/ipfs-client';
// import { TransactionClient } from './client/transaction-client';
import { ProximaxDataService } from './proximax-data-service';
import { UploadService } from './upload-service';

describe('UploadService', () => {
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
      name,
      description,
      contentType,
      metadata,
      byteStreams,
      undefined,
      options
    );

    const uploadParam = new UploadParameter(
      uploadParamData,
      SenderAccount.privateKey,
      RecipientAccount.publicKey,
      RecipientAccount.address,
      PrivacyType.PLAIN,
      1,
      false,
      true,
      SchemaVersion
    );

    await uploadService.upload(uploadParam).subscribe(uploadResult => {
      // console.log(response);
      expect(uploadResult.transactionHash).to.be.not.equal(undefined);
      expect(uploadResult.data!.dataHash).to.be.equal(expectedHash);
    });
  });
});
