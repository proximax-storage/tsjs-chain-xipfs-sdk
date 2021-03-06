import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import 'mocha';
import {
  BlockchainNetworkConnection,
  BlockchainNetworkType,
  IpfsConnection,
  StreamHelper
} from '../../src/index';
import { ConnectionConfig } from '../../src/lib/connection/connection-config';
import { Protocol } from '../../src/lib/connection/protocol';
import { DirectDownloadParameter } from '../../src/lib/download/direct-download-parameter';
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

describe('Downloader integration tests for direct download with secure message', () => {
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

  it('should direct download upload with secure message as sender', async () => {
    const expectedText = 'Proximax P2P Uploader with secured message';

    const param = DirectDownloadParameter.createFromTransactionHash(
      transactionHashOfSecureMessageUpload,
      SenderAccount.privateKey
    ).build();

    const resultStream = await downloader.directDownload(param);
    const actual = await StreamHelper.stream2String(resultStream);

    expect(actual).to.be.equal(expectedText);
  }).timeout(10000);

  it('should direct download upload with secure message as receiver', async () => {
    const expectedText = 'Proximax P2P Uploader with secured message';

    const param = DirectDownloadParameter.createFromTransactionHash(
      transactionHashOfSecureMessageUpload,
      RecipientAccount.privateKey
    ).build();

    const resultStream = await downloader.directDownload(param);
    const actual = await StreamHelper.stream2String(resultStream);

    expect(actual).to.be.equal(expectedText);
  }).timeout(10000);

  it('fail to direct download with wrong private key', async () => {
    const param = DirectDownloadParameter.createFromTransactionHash(
      transactionHashOfSecureMessageUpload,
      NoFundsAccount.privateKey
    ).build();

    expect(downloader.directDownload(param)).to.be.rejectedWith(Error);
  }).timeout(10000);

  it('fail to direct download with no private key', async () => {
    const param = DirectDownloadParameter.createFromTransactionHash(
      transactionHashOfSecureMessageUpload
    ).build();

    expect(downloader.directDownload(param)).to.be.rejectedWith(Error);
  }).timeout(10000);
});
