import { expect } from 'chai';
import 'mocha';
import {
  BlockchainInfo,
  IpfsInfo,
  RecipientAccount,
  SenderAccount
} from '../config/testconfig';
import { BlockchainNetworkConnection } from '../connection/blockchain-network-connection';
import { ConnectionConfig } from '../connection/connection-config';
import { IpfsConnection } from '../connection/ipfs-connection';
import { Protocol } from '../connection/protocol';
import { BlockchainNetworkType } from '../model/blockchain/blockchain-network-type';
import { Uint8ArrayParameterData } from '../upload/uint8-array-parameter-data';
import { UploadParameter } from '../upload/upload-parameter';
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

    const byteStream = new Uint8Array(
      Buffer.from('Proximax P2P CreateProximaxDataService')
    );
    const metadata = new Map<string, string>();
    metadata.set('author', 'Proximax');
    const paramData = Uint8ArrayParameterData.create(
      byteStream,
      'Test',
      'Test decription',
      'text/plain',
      metadata
    );

    const param = UploadParameter.createForUint8ArrayUpload(
      paramData,
      SenderAccount.privateKey
    ).build();

    const dataModel = await createProximaxDataService.createData(param);

    expect(!!dataModel.dataHash).to.be.true;
    expect(!!dataModel.digest).to.be.false;
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

    const byteStream = new Uint8Array(
      Buffer.from('Proximax P2P CreateProximaxDataService')
    );
    const metadata = new Map<string, string>();
    metadata.set('author', 'Proximax');
    const paramData = Uint8ArrayParameterData.create(
      byteStream,
      'Test',
      'Test decription',
      'text/plain',
      metadata
    );

    const param = UploadParameter.createForUint8ArrayUpload(
      paramData,
      SenderAccount.privateKey
    )
      .withRecipientPublicKey(RecipientAccount.publicKey)
      .withRecipientAddress(RecipientAccount.address)
      .withPlainPrivacy()
      .withTransactionDeadline(1)
      .withUseBlockchainSecureMessage(false)
      .build();

    const dataModel = await createProximaxDataService.createData(param);

    expect(!!dataModel.dataHash).to.be.true;
    expect(!!dataModel.digest).to.be.false;
    expect(dataModel.contentType).to.be.equal('text/plain');
  });
});
