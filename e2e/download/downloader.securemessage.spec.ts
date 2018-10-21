import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import 'mocha';
import {
  BlockchainNetworkConnection,
  BlockchainNetworkType,
  IpfsConnection
} from '../../src';
import { ConnectionConfig } from '../../src/lib/connection/connection-config';
import { Protocol } from '../../src/lib/connection/protocol';
import { DownloadParameter } from '../../src/lib/download/download-parameter';
import { Downloader } from '../../src/lib/download/downloader';
import {
  BlockchainInfo,
  IpfsInfo,
  NoFundsAccount,
  RecipientAccount,
  SenderAccount
} from '../integrationtestconfig';

chai.use(chaiAsPromised);

describe('Downloader integration tests for secure message', () => {
  const connectionConfig = ConnectionConfig.createWithLocalIpfsConnection(
    new BlockchainNetworkConnection(
      BlockchainNetworkType.MIJIN_TEST,
      BlockchainInfo.apiHost,
      BlockchainInfo.apiPort,
      Protocol.HTTP
    ),
    new IpfsConnection(IpfsInfo.multiaddress, IpfsInfo.port)
  );
  const downloader = new Downloader(connectionConfig);

  const transactionHashOfSecureMessageUpload =
    'C6450FAFB9127E3D396DAF2C90A2DBB05AC70AC1575690971C771D16D085042D';

  it('should download upload with secure message as sender', async () => {
    const expectedText = 'Proximax P2P Uploader with secured message';

    const param = DownloadParameter.create(transactionHashOfSecureMessageUpload)
      .withAccountPrivateKey(SenderAccount.privateKey)
      .build();

    const result = await downloader.download(param);
    const actual = await result.data.getContentsAsString();

    expect(actual).to.be.equal(expectedText);
  }).timeout(10000);

  it('should download upload with secure message as receiver', async () => {
    const expectedText = 'Proximax P2P Uploader with secured message';

    const param = DownloadParameter.create(transactionHashOfSecureMessageUpload)
      .withAccountPrivateKey(RecipientAccount.privateKey)
      .build();

    const result = await downloader.download(param);
    const actual = await result.data.getContentsAsString();

    expect(actual).to.be.equal(expectedText);
  }).timeout(10000);

  it('fail to download with wrong private key', async () => {
    const param = DownloadParameter.create(transactionHashOfSecureMessageUpload)
      .withAccountPrivateKey(NoFundsAccount.privateKey)
      .build();

    expect(downloader.download(param)).to.be.rejectedWith(Error);
  }).timeout(10000);

  it('fail to download with no private key', async () => {
    const param = DownloadParameter.create(
      transactionHashOfSecureMessageUpload
    ).build();

    expect(downloader.download(param)).to.be.rejectedWith(Error);
  }).timeout(10000);
});
