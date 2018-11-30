import { expect } from 'chai';
import 'mocha';
import {
  IpfsInfo,
  RecipientAccount,
  SenderAccount
} from '../config/testconfig';
import { IpfsConnection } from '../connection/ipfs-connection';
import { Uint8ArrayParameterData } from '../upload/uint8-array-parameter-data';
import { UploadParameter } from '../upload/upload-parameter';
import { CreateProximaxDataService } from './create-proximax-data-service';

describe('CreateProximaxDataService', () => {
  const createProximaxDataService = new CreateProximaxDataService(
    new IpfsConnection(IpfsInfo.host, IpfsInfo.port)
  );

  it('should add data to ipfs and return ProximaxDataModel', async () => {
    const uint8Array = new Uint8Array(
      Buffer.from('Proximax P2P CreateProximaxDataService')
    );
    const metadata = new Map<string, string>();
    metadata.set('author', 'Proximax');
    const paramData = Uint8ArrayParameterData.create(
      uint8Array,
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
    const uint8Array = new Uint8Array(
      Buffer.from('Proximax P2P CreateProximaxDataService')
    );
    const metadata = new Map<string, string>();
    metadata.set('author', 'Proximax');
    const paramData = Uint8ArrayParameterData.create(
      uint8Array,
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
