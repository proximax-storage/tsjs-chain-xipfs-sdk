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
import { TestDataRepository } from '../testdatarepository';

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
    const transactionHash = TestDataRepository.getData(
      'shouldUploadUint8Array',
      'transactionHash'
    );
    const expectedText = 'Proximax P2P Uploader test';

    const param = DirectDownloadParameter.createFromTransactionHash(
      transactionHash
    ).build();

    const resultStream = await downloader.directDownload(param);
    const actual = await StreamHelper.stream2String(resultStream);

    expect(actual).to.be.equal(expectedText);
  }).timeout(10000);

  it('should download file upload', async () => {
    const transactionHash = TestDataRepository.getData(
      'shouldUploadFile',
      'transactionHash'
    );
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
    const transactionHash = TestDataRepository.getData(
      'shouldUploadUrlResource',
      'transactionHash'
    );
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
    const transactionHash = TestDataRepository.getData(
      'shouldUploadString',
      'transactionHash'
    );
    const expectedText = 'the quick brown fox jumps over the lazy dog';

    const param = DirectDownloadParameter.createFromTransactionHash(
      transactionHash
    ).build();

    const resultStream = await downloader.directDownload(param);
    const actual = await StreamHelper.stream2String(resultStream);

    expect(actual).to.be.equal(expectedText);
  }).timeout(10000);

  it('should download readable stream upload', async () => {
    const transactionHash = TestDataRepository.getData(
      'shouldUploadReadableStream',
      'transactionHash'
    );
    const expectedText = 'readable stream is awesome';

    const param = DirectDownloadParameter.createFromTransactionHash(
      transactionHash
    ).build();

    const resultStream = await downloader.directDownload(param);
    const actual = await StreamHelper.stream2String(resultStream);

    expect(actual).to.be.equal(expectedText);
  }).timeout(10000);
});
