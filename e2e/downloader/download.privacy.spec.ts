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
  SamplePassword,
  SenderAccount
} from '../integrationtestconfig';
import { TestDataRepository } from '../testdatarepository';

chai.use(chaiAsPromised);

describe('Downloader integration tests for download with privacy strategies', () => {
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

  it('should download upload with plain privacy', async () => {
    const transactionHash = TestDataRepository.getData(
      'shouldUploadWithPlainPrivacyStrategy',
      'transactionHash'
    );
    const expectedText = 'Proximax P2P Uploader with plain privacy';

    const param = DownloadParameter.create(transactionHash)
      .withPlainPrivacy()
      .build();

    const result = await downloader.download(param);
    const actual = await result.data.getContentsAsString();

    expect(actual).to.be.equal(expectedText);
  }).timeout(10000);

  it('should download upload with nem keys privacy', async () => {
    const transactionHash = TestDataRepository.getData(
      'shouldUploadWithSecuredWithNemKeysPrivacyStrategy',
      'transactionHash'
    );
    const expectedText = 'Proximax P2P Uploader with nem keys privacy';

    const param = DownloadParameter.create(transactionHash)
      .withNemKeysPrivacy(SenderAccount.privateKey, RecipientAccount.publicKey)
      .build();

    const result = await downloader.download(param);
    const actual = await result.data.getContentsAsString();

    expect(actual).to.be.equal(expectedText);
  }).timeout(10000);

  it('fail to download with wrong private key', async () => {
    const transactionHash = TestDataRepository.getData(
      'shouldUploadWithSecuredWithNemKeysPrivacyStrategy',
      'transactionHash'
    );
    const param = DownloadParameter.create(transactionHash)
      .withNemKeysPrivacy(NoFundsAccount.privateKey, RecipientAccount.publicKey)
      .build();

    const result = await downloader.download(param);

    expect(result.data.getContentsAsString()).to.be.rejectedWith(Error);
  }).timeout(10000);

  it('should download upload with password privacy', async () => {
    const transactionHash = TestDataRepository.getData(
      'shouldUploadWithSecuredWithPasswordPrivacyStrategy',
      'transactionHash'
    );
    const expectedText = 'Proximax P2P Uploader with password privacy';

    const param = DownloadParameter.create(transactionHash)
      .withPasswordPrivacy(SamplePassword)
      .build();

    const result = await downloader.download(param);
    const actual = await result.data.getContentsAsString();

    expect(actual).to.be.equal(expectedText);
  }).timeout(10000);

  it('fail to download with wrong password', async () => {
    const transactionHash = TestDataRepository.getData(
      'shouldUploadWithSecuredWithPasswordPrivacyStrategy',
      'transactionHash'
    );
    const param = DownloadParameter.create(transactionHash)
      .withPasswordPrivacy('WrongPassword')
      .build();

    const result = await downloader.download(param);

    expect(result.data.getContentsAsString()).to.be.rejectedWith(Error);
  }).timeout(10000);
});
