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

chai.use(chaiAsPromised);

describe('Uploader integration tests for transaction config', () => {
  const connectionConfig = ConnectionConfig.createWithLocalIpfsConnection(
    new BlockchainNetworkConnection(
      BlockchainNetworkType.MIJIN_TEST,
      BlockchainInfo.apiHost,
      BlockchainInfo.apiPort,
      Protocol.HTTP
    ),
    new IpfsConnection(IpfsInfo.multiaddress, IpfsInfo.port)
  );

  const uploader = new Uploader(connectionConfig);

  it('should upload with signer as recipient by default', async () => {
    const param = UploadParameter.createForUint8ArrayUpload(
      new Uint8Array(Buffer.from('Proximax P2P Uploader')),
      SenderAccount.privateKey
    ).build();

    const result = await uploader.upload(param);

    expect(result.transactionHash.length > 0).to.be.true;
    expect(result.data.dataHash.length > 0).to.be.true;
  }).timeout(10000);

  it('should upload with recipient public key', async () => {
    const param = UploadParameter.createForUint8ArrayUpload(
      new Uint8Array(Buffer.from('Proximax P2P Uploader')),
      SenderAccount.privateKey
    )
      .withRecipientPublicKey(RecipientAccount.publicKey)
      .build();

    const result = await uploader.upload(param);

    expect(result.transactionHash.length > 0).to.be.true;
    expect(result.data.dataHash.length > 0).to.be.true;
  }).timeout(10000);

  it('should upload with recipient address', async () => {
    const param = UploadParameter.createForUint8ArrayUpload(
      new Uint8Array(Buffer.from('Proximax P2P Uploader')),
      SenderAccount.privateKey
    )
      .withRecipientAddress(RecipientAccount.address)
      .build();

    const result = await uploader.upload(param);

    expect(result.transactionHash.length > 0).to.be.true;
    expect(result.data.dataHash.length > 0).to.be.true;
  }).timeout(10000);

  it('should fail on insufficient funds', async () => {
    const byteStream = new Uint8Array(
      Buffer.from('Proximax P2P Uploader test')
    );

    const param = UploadParameter.createForUint8ArrayUpload(
      byteStream,
      NoFundsAccount.privateKey
    ).build();

    expect(uploader.upload(param)).to.be.rejectedWith(Error);
  }).timeout(10000);

  it('should upload with transaction deadline', async () => {
    const param = UploadParameter.createForUint8ArrayUpload(
      new Uint8Array(Buffer.from('Proximax P2P Uploader')),
      SenderAccount.privateKey
    )
      .withTransactionDeadline(2)
      .build();

    const result = await uploader.upload(param);

    expect(result.transactionHash.length > 0).to.be.true;
    expect(result.data.dataHash.length > 0).to.be.true;
  }).timeout(10000);
});
