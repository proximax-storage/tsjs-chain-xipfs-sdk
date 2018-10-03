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
import { ConnectionConfig } from '../connection/connection-config';
import { IpfsConnection } from '../connection/ipfs-connection';
import { Protocol } from '../connection/protocol';
import { BlockchainNetworkType } from '../model/blockchain/blockchain-network-type';
import { PlainPrivacyStrategy } from '../privacy/plain-privacy';
import { UploadParameter } from '../upload/upload-parameter';
import { UploadParameterData } from '../upload/upload-parameter-data';
import { CreateProximaxDataService } from './create-proximax-data-service';

describe('CreateProximaxDataService', () => {
  it('should add data to ipfs and return ProximaxDataModel', async () => {
    const connectionConfig = ConnectionConfig.createWithLocalIpfsConnection(
      new BlockchainNetworkConnection(
        BlockchainNetworkType.MIJIN_TEST,
        BlockchainInfo.apiHost,
        BlockchainInfo.apiPort,
        Protocol.HTTP
      ),
      new IpfsConnection(IpfsInfo.multiaddress, IpfsInfo.port)
    );

    const createProximaxDataService = new CreateProximaxDataService(
      connectionConfig
    );

    const byteStream = Buffer.from('Proximax P2P CreateProximaxDataService');
    const metadata = new Map<string, string>();
    metadata.set('author', 'Proximax');
    const paramData = new UploadParameterData(
      'Test',
      'Test decription',
      'text/plain',
      metadata,
      byteStream
    );
    const param = new UploadParameter(
      paramData,
      SenderAccount.privateKey,
      RecipientAccount.publicKey,
      RecipientAccount.address,
      PlainPrivacyStrategy.create(),
      1,
      false,
      true,
      true,
      SchemaVersion
    );

    await createProximaxDataService.createData(param).subscribe(dataModel => {
      // console.log(dataModel);
      expect(dataModel.dataHash.length > 0).to.be.true;
      expect(dataModel.digest!.length > 0).to.be.true;
    });
  });

  it('should add data to ipfs and auto detect content type and return ProximaxDataModel', async () => {
    const connectionConfig = ConnectionConfig.createWithLocalIpfsConnection(
      new BlockchainNetworkConnection(
        BlockchainNetworkType.MIJIN_TEST,
        BlockchainInfo.apiHost,
        BlockchainInfo.apiPort,
        Protocol.HTTP
      ),
      new IpfsConnection(IpfsInfo.multiaddress, IpfsInfo.port)
    );

    const createProximaxDataService = new CreateProximaxDataService(
      connectionConfig
    );

    const byteStream = Buffer.from('Proximax P2P CreateProximaxDataService');
    const metadata = new Map<string, string>();
    metadata.set('author', 'Proximax');
    const paramData = new UploadParameterData(
      'Test',
      'Test decription',
      '',
      metadata,
      byteStream
    );
    const param = new UploadParameter(
      paramData,
      SenderAccount.privateKey,
      RecipientAccount.publicKey,
      RecipientAccount.address,
      PlainPrivacyStrategy.create(),
      1,
      false,
      true,
      true,
      SchemaVersion
    );

    await createProximaxDataService.createData(param).subscribe(dataModel => {
      // console.log(dataModel);
      expect(dataModel.dataHash.length > 0).to.be.true;
      expect(dataModel.contentType!).to.be.equal('text/plain');
      expect(dataModel.digest!.length > 0).to.be.true;
    });
  });
});
