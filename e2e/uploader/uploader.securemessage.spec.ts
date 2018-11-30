import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import 'mocha';
import { BlockchainNetworkConnection } from '../../src/lib/connection/blockchain-network-connection';
import { ConnectionConfig } from '../../src/lib/connection/connection-config';
import { IpfsConnection } from '../../src/lib/connection/ipfs-connection';
import { Protocol } from '../../src/lib/connection/protocol';
import { BlockchainNetworkType } from '../../src/lib/model/blockchain/blockchain-network-type';
import { UploadParameter } from '../../src/lib/upload/upload-parameter';
import { Uploader } from '../../src/lib/upload/uploader';
import {
  BlockchainInfo,
  IpfsInfo,
  NoFundsAccount,
  RecipientAccount,
  SenderAccount
} from '../integrationtestconfig';
import { TestDataRepository } from '../testdatarepository';

chai.use(chaiAsPromised);

describe('Uploader integration tests for secure message', () => {
  const connectionConfig = ConnectionConfig.createWithLocalIpfsConnection(
    new BlockchainNetworkConnection(
      BlockchainNetworkType.MIJIN_TEST,
      BlockchainInfo.apiHost,
      BlockchainInfo.apiPort,
      Protocol.HTTP
    ),
    new IpfsConnection(IpfsInfo.host, IpfsInfo.port)
  );

  const uploader = new Uploader(connectionConfig);

  it('should upload with secured message', async () => {
    const param = UploadParameter.createForUint8ArrayUpload(
      new Uint8Array(Buffer.from('Proximax P2P Uploader with secured message')),
      SenderAccount.privateKey
    )
      .withUseBlockchainSecureMessage(true)
      .build();

    const result = await uploader.upload(param);

    expect(result.transactionHash.length > 0).to.be.true;
    expect(result.data.dataHash.length > 0).to.be.true;

    TestDataRepository.logAndSaveResult(
      result,
      'shouldUploadWithUseBlockchainSecureMessage'
    );
  }).timeout(10000);

  it('should upload with secured message and specified recipient public key', async () => {
    const param = UploadParameter.createForUint8ArrayUpload(
      new Uint8Array(Buffer.from('Proximax P2P Uploader with secured message')),
      SenderAccount.privateKey
    )
      .withRecipientPublicKey(RecipientAccount.publicKey)
      .withUseBlockchainSecureMessage(true)
      .build();

    const result = await uploader.upload(param);

    expect(result.transactionHash.length > 0).to.be.true;
    expect(result.data.dataHash.length > 0).to.be.true;

    TestDataRepository.logAndSaveResult(
      result,
      'shouldUploadWithUseBlockchainSecureMessageAndRecipientPublicKey'
    );
  }).timeout(10000);

  it('should upload with secured message and specified recipient address', async () => {
    const param = UploadParameter.createForUint8ArrayUpload(
      new Uint8Array(Buffer.from('Proximax P2P Uploader with secured message')),
      SenderAccount.privateKey
    )
      .withRecipientAddress(RecipientAccount.address)
      .withUseBlockchainSecureMessage(true)
      .build();

    const result = await uploader.upload(param);

    expect(result.transactionHash.length > 0).to.be.true;
    expect(result.data.dataHash.length > 0).to.be.true;

    TestDataRepository.logAndSaveResult(
      result,
      'shouldUploadWithUseBlockchainSecureMessageAndRecipientAddress'
    );
  }).timeout(10000);

  it('fail to upload with secured message when recipient public key is not yet known on blockchain', async () => {
    const param = UploadParameter.createForUint8ArrayUpload(
      new Uint8Array(Buffer.from('Proximax P2P Uploader with secured message')),
      SenderAccount.privateKey
    )
      .withRecipientAddress(NoFundsAccount.address)
      .withUseBlockchainSecureMessage(true)
      .build();

    expect(uploader.upload(param)).to.be.rejectedWith(Error);
  }).timeout(10000);
});
