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
  SamplePassword,
  SenderAccount
} from '../integrationtestconfig';
import { TestDataRepository } from '../testdatarepository';

chai.use(chaiAsPromised);

describe('Downloader integration tests for direct download with privacy strategies', () => {
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

  it('should direct download upload using transaction hash with plain privacy', async () => {
    const transactionHash = TestDataRepository.getData(
      'shouldUploadWithPlainPrivacyStrategy',
      'transactionHash'
    );
    const expectedText = 'Proximax P2P Uploader with plain privacy';

    const param = DirectDownloadParameter.createFromTransactionHash(
      transactionHash
    )
      .withPlainPrivacy()
      .build();

    const resultStream = await downloader.directDownload(param);
    const actual = await StreamHelper.stream2String(resultStream);

    expect(actual).to.be.equal(expectedText);
  }).timeout(10000);

  it('should download upload using transaction hash  with nem keys privacy', async () => {
    const transactionHash = TestDataRepository.getData(
      'shouldUploadWithSecuredWithNemKeysPrivacyStrategy',
      'transactionHash'
    );
    const expectedText = 'Proximax P2P Uploader with nem keys privacy';

    const param = DirectDownloadParameter.createFromTransactionHash(
      transactionHash
    )
      .withNemKeysPrivacy(SenderAccount.privateKey, RecipientAccount.publicKey)
      .build();

    const resultStream = await downloader.directDownload(param);
    const actual = await StreamHelper.stream2String(resultStream);

    expect(actual).to.be.equal(expectedText);
  }).timeout(10000);

  it('fail to download using transaction hash with wrong private key', async () => {
    const transactionHash = TestDataRepository.getData(
      'shouldUploadWithSecuredWithNemKeysPrivacyStrategy',
      'transactionHash'
    );

    const param = DirectDownloadParameter.createFromTransactionHash(
      transactionHash
    )
      .withNemKeysPrivacy(NoFundsAccount.privateKey, RecipientAccount.publicKey)
      .build();

    const resultStream = await downloader.directDownload(param);

    expect(StreamHelper.stream2String(resultStream)).to.be.rejectedWith(Error);
  }).timeout(10000);

  it('should download upload using transaction hash with password privacy', async () => {
    const transactionHash = TestDataRepository.getData(
      'shouldUploadWithSecuredWithPasswordPrivacyStrategy',
      'transactionHash'
    );
    const expectedText = 'Proximax P2P Uploader with password privacy';

    const param = DirectDownloadParameter.createFromTransactionHash(
      transactionHash
    )
      .withPasswordPrivacy(SamplePassword)
      .build();

    const resultStream = await downloader.directDownload(param);
    const actual = await StreamHelper.stream2String(resultStream);

    expect(actual).to.be.equal(expectedText);
  }).timeout(10000);

  it('fail to download using transaction hash with wrong password', async () => {
    const transactionHash = TestDataRepository.getData(
      'shouldUploadWithSecuredWithPasswordPrivacyStrategy',
      'transactionHash'
    );
    const param = DirectDownloadParameter.createFromTransactionHash(
      transactionHash
    )
      .withPasswordPrivacy('WrongPassword')
      .build();

    const resultStream = await downloader.directDownload(param);

    expect(StreamHelper.stream2String(resultStream)).to.be.rejectedWith(Error);
  }).timeout(10000);

  it('should direct download upload using data hash with plain privacy', async () => {
    const dataHash = TestDataRepository.getData(
      'shouldUploadWithPlainPrivacyStrategy',
      'dataHash'
    );
    const expectedText = 'Proximax P2P Uploader with plain privacy';

    const param = DirectDownloadParameter.createFromDataHash(dataHash)
      .withPlainPrivacy()
      .build();

    const resultStream = await downloader.directDownload(param);
    const actual = await StreamHelper.stream2String(resultStream);

    expect(actual).to.be.equal(expectedText);
  }).timeout(10000);

  it('should download upload using data hash  with nem keys privacy', async () => {
    const dataHash = TestDataRepository.getData(
      'shouldUploadWithSecuredWithNemKeysPrivacyStrategy',
      'dataHash'
    );
    const expectedText = 'Proximax P2P Uploader with nem keys privacy';

    const param = DirectDownloadParameter.createFromDataHash(dataHash)
      .withNemKeysPrivacy(SenderAccount.privateKey, RecipientAccount.publicKey)
      .build();

    const resultStream = await downloader.directDownload(param);
    const actual = await StreamHelper.stream2String(resultStream);

    expect(actual).to.be.equal(expectedText);
  }).timeout(10000);

  it('fail to download using data hash with wrong private key', async () => {
    const dataHash = TestDataRepository.getData(
      'shouldUploadWithSecuredWithNemKeysPrivacyStrategy',
      'dataHash'
    );
    const param = DirectDownloadParameter.createFromDataHash(dataHash)
      .withNemKeysPrivacy(NoFundsAccount.privateKey, RecipientAccount.publicKey)
      .build();

    const resultStream = await downloader.directDownload(param);

    expect(StreamHelper.stream2String(resultStream)).to.be.rejectedWith(Error);
  }).timeout(10000);

  it('should download upload using data hash with password privacy', async () => {
    const dataHash = TestDataRepository.getData(
      'shouldUploadWithSecuredWithPasswordPrivacyStrategy',
      'dataHash'
    );
    const expectedText = 'Proximax P2P Uploader with password privacy';

    const param = DirectDownloadParameter.createFromDataHash(dataHash)
      .withPasswordPrivacy(SamplePassword)
      .build();

    const resultStream = await downloader.directDownload(param);
    const actual = await StreamHelper.stream2String(resultStream);

    expect(actual).to.be.equal(expectedText);
  }).timeout(10000);

  it('fail to download using data hash with wrong password', async () => {
    const dataHash = TestDataRepository.getData(
      'shouldUploadWithSecuredWithPasswordPrivacyStrategy',
      'dataHash'
    );
    const param = DirectDownloadParameter.createFromDataHash(dataHash)
      .withPasswordPrivacy('WrongPassword')
      .build();

    const resultStream = await downloader.directDownload(param);

    expect(StreamHelper.stream2String(resultStream)).to.be.rejectedWith(Error);
  }).timeout(10000);
});
