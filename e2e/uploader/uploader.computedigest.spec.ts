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
  SenderAccount
} from '../integrationtestconfig';

chai.use(chaiAsPromised);

describe('Uploader integration tests for compute digest', () => {
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

  it('should upload with enabled compute digest', async () => {
    const param = UploadParameter.createForStringUpload(
      'Proximax P2P Uploader for string test',
      SenderAccount.privateKey
    )
      .withComputeDigest(true)
      .build();

    const result = await uploader.upload(param);

    expect(result.transactionHash.length > 0).to.be.true;
    expect(result.data.dataHash.length > 0).to.be.true;
    expect(result.data.digest && result.data.digest.length > 0).to.be.true;

    console.log(`Transaction Hash: ${result.transactionHash}`);
    console.log(`Data Hash: ${result.data.dataHash}`);
    console.log(`Data Digest: ${result.data.digest}`);
  }).timeout(10000);

  it('should upload with disabled compute digest', async () => {
    const param = UploadParameter.createForStringUpload(
      'Proximax P2P Uploader with nem keys privacy',
      SenderAccount.privateKey
    )
      .withComputeDigest(false)
      .build();

    const result = await uploader.upload(param);

    expect(result.transactionHash.length > 0).to.be.true;
    expect(result.data.dataHash.length > 0).to.be.true;
    expect(result.data.digest !== undefined && result.data.digest.length > 0).to
      .be.false;

    console.log(`Transaction Hash: ${result.transactionHash}`);
    console.log(`Data Hash: ${result.data.dataHash}`);
  }).timeout(10000);
});
