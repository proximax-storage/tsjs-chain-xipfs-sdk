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

chai.use(chaiAsPromised);

describe('Downloader integration tests for download with privacy strategies', () => {
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

  it('should download upload with plain privacy', async () => {
    const transactionHash =
      '520635F1435F78D0840786FD298AD4034D69B21E1549C611E25C59258D48521A';
    const expectedText = 'Proximax P2P Uploader with plain privacy';

    const param = DownloadParameter.create(transactionHash)
      .withPlainPrivacy()
      .build();

    const result = await downloader.download(param);
    const actual = await result.data.getContentsAsString();

    expect(actual).to.be.equal(expectedText);
  }).timeout(10000);

  it('should download upload with nem keys privacy', async () => {
    const transactionHash =
      '06AC4209AAFC5B9FE5CE2C06DA16E21DE5E5753E24AE9B65A1CDB620FFCDA6DA';
    const expectedText = 'Proximax P2P Uploader with nem keys privacy';

    const param = DownloadParameter.create(transactionHash)
      .withNemKeysPrivacy(SenderAccount.privateKey, RecipientAccount.publicKey)
      .build();

    const result = await downloader.download(param);
    const actual = await result.data.getContentsAsString();

    expect(actual).to.be.equal(expectedText);
  }).timeout(10000);

  it('fail to download with wrong private key', async () => {
    const transactionHash =
      '06AC4209AAFC5B9FE5CE2C06DA16E21DE5E5753E24AE9B65A1CDB620FFCDA6DA';

    const param = DownloadParameter.create(transactionHash)
      .withNemKeysPrivacy(NoFundsAccount.privateKey, RecipientAccount.publicKey)
      .build();

    const result = await downloader.download(param);

    expect(result.data.getContentsAsString()).to.be.rejectedWith(Error);
  }).timeout(10000);

  it('should download upload with password privacy', async () => {
    const transactionHash =
      'E853948733C1DD97641BEF6D7641FA70ECFDB63B11DE9EA50A2531CD2D0A165F';
    const expectedText = 'Proximax P2P Uploader with password privacy';

    const param = DownloadParameter.create(transactionHash)
      .withPasswordPrivacy(SamplePassword)
      .build();

    const result = await downloader.download(param);
    const actual = await result.data.getContentsAsString();

    expect(actual).to.be.equal(expectedText);
  }).timeout(10000);

  it('fail to download with wrong password', async () => {
    const transactionHash =
      'E853948733C1DD97641BEF6D7641FA70ECFDB63B11DE9EA50A2531CD2D0A165F';

    const param = DownloadParameter.create(transactionHash)
      .withPasswordPrivacy('WrongPassword')
      .build();

    const result = await downloader.download(param);

    expect(result.data.getContentsAsString()).to.be.rejectedWith(Error);
  }).timeout(10000);
});
