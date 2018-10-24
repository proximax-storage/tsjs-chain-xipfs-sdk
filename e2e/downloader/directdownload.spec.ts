import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fs from 'fs';
import 'mocha';
import {
  BlockchainNetworkConnection,
  BlockchainNetworkType,
  IpfsConnection
} from '../../src/index';
import { ConnectionConfig } from '../../src/lib/connection/connection-config';
import { Protocol } from '../../src/lib/connection/protocol';
import { DirectDownloadParameter } from '../../src/lib/download/direct-download-parameter';
import { Downloader } from '../../src/lib/download/downloader';
import { StreamHelper } from '../../src/lib/helper/stream-helper';
import { BlockchainInfo, IpfsInfo } from '../integrationtestconfig';

chai.use(chaiAsPromised);

describe('Downloader integration tests for direct download', () => {
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

  it('failed with invalid transaction hash', async () => {
    const transactionHash =
      'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';

    const param = DirectDownloadParameter.createFromTransactionHash(
      transactionHash
    ).build();

    expect(downloader.directDownload(param)).to.be.rejectedWith(Error);
  }).timeout(10000);

  it('should download uint8array upload', async () => {
    const transactionHash =
      '14FEB7849A910B10075030BEB2F5276322AEBD7EC0CB88D1E9E765A8EF793125';

    const expectedText = 'Proximax P2P Uploader test';

    const param = DirectDownloadParameter.createFromTransactionHash(
      transactionHash
    ).build();

    const resultStream = await downloader.directDownload(param);
    const actual = await StreamHelper.stream2String(resultStream);

    expect(actual).to.be.equal(expectedText);
  }).timeout(10000);

  it('should download file upload', async () => {
    const transactionHash =
      '5605CA0590C2ADC5527276534FC56B16070EAF8373DA038A5C5D7EF154C7E42D';

    const expectedBuffer = await StreamHelper.stream2Buffer(
      fs.createReadStream('./e2e/testresources/test_pdf_file_2.pdf')
    );

    const param = DirectDownloadParameter.createFromTransactionHash(
      transactionHash
    ).build();

    const resultStream = await downloader.directDownload(param);
    const actual = await StreamHelper.stream2Buffer(resultStream);

    expect(actual).to.be.eql(expectedBuffer);
  }).timeout(10000);

  it('should download url resource upload', async () => {
    const transactionHash =
      '98FC1EB6373CB72BA06F229C1B5A4C92654217500AA4380C164D1C3CFCF4EC8D';

    const urlReadableStream = await StreamHelper.urlReadableStream(
      'https://proximax.io/wp-content/uploads/2018/03/ProximaX-logotype.png'
    );
    const expectedBuffer = await StreamHelper.stream2Buffer(urlReadableStream);

    const param = DirectDownloadParameter.createFromTransactionHash(
      transactionHash
    ).build();

    const resultStream = await downloader.directDownload(param);
    const actual = await StreamHelper.stream2Buffer(resultStream);

    expect(actual).to.be.eql(expectedBuffer);
  }).timeout(10000);

  it('should download string upload', async () => {
    const transactionHash =
      'E8F295D6D96200A2684FE42B359C92AF3763BE0A5B699595D2DC64B00E8E609A';

    const expectedText = 'the quick brown fox jumps over the lazy dog';

    const param = DirectDownloadParameter.createFromTransactionHash(
      transactionHash
    ).build();

    const resultStream = await downloader.directDownload(param);
    const actual = await StreamHelper.stream2String(resultStream);

    expect(actual).to.be.equal(expectedText);
  }).timeout(10000);

  it('should download readable stream upload', async () => {
    const transactionHash =
      'E712BD47D33C3A0A13357E93DC86024E50520B7BBC74EA86FDE947788C5D83B9';

    const expectedText = 'readable stream is awesome';

    const param = DirectDownloadParameter.createFromTransactionHash(
      transactionHash
    ).build();

    const resultStream = await downloader.directDownload(param);
    const actual = await StreamHelper.stream2String(resultStream);

    expect(actual).to.be.equal(expectedText);
  }).timeout(10000);
});
