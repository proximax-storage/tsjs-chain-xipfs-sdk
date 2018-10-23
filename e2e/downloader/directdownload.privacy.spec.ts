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

chai.use(chaiAsPromised);

describe('Downloader integration tests for direct download with privacy strategies', () => {
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

  it('should direct download upload using transaction hash with plain privacy', async () => {
    const transactionHash =
      '520635F1435F78D0840786FD298AD4034D69B21E1549C611E25C59258D48521A';
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
    const transactionHash =
      '06AC4209AAFC5B9FE5CE2C06DA16E21DE5E5753E24AE9B65A1CDB620FFCDA6DA';
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
    const transactionHash =
      '06AC4209AAFC5B9FE5CE2C06DA16E21DE5E5753E24AE9B65A1CDB620FFCDA6DA';

    const param = DirectDownloadParameter.createFromTransactionHash(
      transactionHash
    )
      .withNemKeysPrivacy(NoFundsAccount.privateKey, RecipientAccount.publicKey)
      .build();

    const resultStream = await downloader.directDownload(param);

    expect(StreamHelper.stream2String(resultStream)).to.be.rejectedWith(Error);
  }).timeout(10000);

  it('should download upload using transaction hash with password privacy', async () => {
    const transactionHash =
      'E853948733C1DD97641BEF6D7641FA70ECFDB63B11DE9EA50A2531CD2D0A165F';
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
    const transactionHash =
      'E853948733C1DD97641BEF6D7641FA70ECFDB63B11DE9EA50A2531CD2D0A165F';

    const param = DirectDownloadParameter.createFromTransactionHash(
      transactionHash
    )
      .withPasswordPrivacy('WrongPassword')
      .build();

    const resultStream = await downloader.directDownload(param);

    expect(StreamHelper.stream2String(resultStream)).to.be.rejectedWith(Error);
  }).timeout(10000);

  it('should direct download upload using data hash with plain privacy', async () => {
    const dataHash = 'QmNWh1w926yH3GF7rh23Boo2wSidgS7YXzQ1wiZxShbCMh';
    const expectedText = 'Proximax P2P Uploader with plain privacy';

    const param = DirectDownloadParameter.createFromDataHash(dataHash)
      .withPlainPrivacy()
      .build();

    const resultStream = await downloader.directDownload(param);
    const actual = await StreamHelper.stream2String(resultStream);

    expect(actual).to.be.equal(expectedText);
  }).timeout(10000);

  it('should download upload using data hash  with nem keys privacy', async () => {
    const dataHash = 'QmSCi77DypyC9K8yvv8fGnEG8jhM8UicnesYT4hJ4JkmHe';
    const expectedText = 'Proximax P2P Uploader with nem keys privacy';

    const param = DirectDownloadParameter.createFromDataHash(dataHash)
      .withNemKeysPrivacy(SenderAccount.privateKey, RecipientAccount.publicKey)
      .build();

    const resultStream = await downloader.directDownload(param);
    const actual = await StreamHelper.stream2String(resultStream);

    expect(actual).to.be.equal(expectedText);
  }).timeout(10000);

  it('fail to download using data hash with wrong private key', async () => {
    const dataHash = 'QmSCi77DypyC9K8yvv8fGnEG8jhM8UicnesYT4hJ4JkmHe';

    const param = DirectDownloadParameter.createFromDataHash(dataHash)
      .withNemKeysPrivacy(NoFundsAccount.privateKey, RecipientAccount.publicKey)
      .build();

    const resultStream = await downloader.directDownload(param);

    expect(StreamHelper.stream2String(resultStream)).to.be.rejectedWith(Error);
  }).timeout(10000);

  it('should download upload using data hash with password privacy', async () => {
    const dataHash = 'QmPswLHJdwQtxgtoC4Uifg9yNT62vuRuFfvcmdJtyhm9wJ';
    const expectedText = 'Proximax P2P Uploader with password privacy';

    const param = DirectDownloadParameter.createFromDataHash(dataHash)
      .withPasswordPrivacy(SamplePassword)
      .build();

    const resultStream = await downloader.directDownload(param);
    const actual = await StreamHelper.stream2String(resultStream);

    expect(actual).to.be.equal(expectedText);
  }).timeout(10000);

  it('fail to download using data hash with wrong password', async () => {
    const dataHash = 'QmPswLHJdwQtxgtoC4Uifg9yNT62vuRuFfvcmdJtyhm9wJ';

    const param = DirectDownloadParameter.createFromDataHash(dataHash)
      .withPasswordPrivacy('WrongPassword')
      .build();

    const resultStream = await downloader.directDownload(param);

    expect(StreamHelper.stream2String(resultStream)).to.be.rejectedWith(Error);
  }).timeout(10000);
});
