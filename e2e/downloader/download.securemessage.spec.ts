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
import { TestDataRepository } from '../testdatarepository';

chai.use(chaiAsPromised);

describe('Downloader integration tests for download with secure message', () => {
  const connectionConfig = ConnectionConfig.createWithLocalIpfsConnection(
    new BlockchainNetworkConnection(
      BlockchainNetworkType.MIJIN_TEST,
      BlockchainInfo.apiHost,
      BlockchainInfo.apiPort,
      Protocol.HTTP
    ),
    new IpfsConnection(IpfsInfo.host, IpfsInfo.port)
  );
  const downloader = new Downloader(connectionConfig);

  const transactionHashOfSecureMessageUpload = TestDataRepository.getData(
    'shouldUploadWithUseBlockchainSecureMessageAndRecipientPublicKey',
    'transactionHash'
  );

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
