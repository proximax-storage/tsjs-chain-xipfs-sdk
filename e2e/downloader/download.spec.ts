import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fs from 'fs';
import 'mocha';
import {
  BlockchainNetworkConnection,
  BlockchainNetworkType,
  IpfsConnection
} from '../../src';
import { SchemaVersion } from '../../src/lib/config/constants';
import { ConnectionConfig } from '../../src/lib/connection/connection-config';
import { Protocol } from '../../src/lib/connection/protocol';
import { DownloadParameter } from '../../src/lib/download/download-parameter';
import { Downloader } from '../../src/lib/download/downloader';
import { StreamHelper } from '../../src/lib/helper/stream-helper';
import { BlockchainInfo, IpfsInfo } from '../integrationtestconfig';
import { TestDataRepository } from '../testdatarepository';

chai.use(chaiAsPromised);

describe('Downloader integration tests for download', () => {
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

    const param = DownloadParameter.create(transactionHash).build();

    expect(downloader.download(param)).to.be.rejectedWith(Error);
  }).timeout(10000);

  it('should download with version', async () => {
    const transactionHash =
      '74B5B26AD0CA967F136B808CF41FEDA6D196E52810144AFBE08921A96B52489E';
    const expectedText = 'Proximax P2P Uploader for string test';

    const param = DownloadParameter.create(transactionHash).build();

    const result = await downloader.download(param);
    const actual = await result.data.getContentsAsString();

    expect(actual).to.be.equal(expectedText);
    expect(result.version).to.be.equal(SchemaVersion);
  }).timeout(10000);

  it('should download uint8array upload', async () => {
    const transactionHash = TestDataRepository.getData(
      'shouldUploadUint8Array',
      'transactionHash'
    );
    const expectedText = 'Proximax P2P Uploader test';

    const param = DownloadParameter.create(transactionHash).build();

    const result = await downloader.download(param);
    const actual = await result.data.getContentsAsString();

    expect(actual).to.be.equal(expectedText);
    expect(result.data.contentType).to.be.undefined;
    expect(result.data.metadata).to.be.undefined;
    expect(result.data.description).to.be.undefined;
    expect(result.data.name).to.be.undefined;
  }).timeout(10000);

  it('should download uint8array upload with complete details', async () => {
    const transactionHash = TestDataRepository.getData(
      'shouldUploadUint8ArrayWithCompleteDetails',
      'transactionHash'
    );
    const expectedText = 'Proximax P2P Uploader test';
    const expectedMetadata = new Map<string, string>();
    expectedMetadata.set('author', 'Proximax');

    const param = DownloadParameter.create(transactionHash).build();

    const result = await downloader.download(param);
    const actual = await result.data.getContentsAsString();

    expect(actual).to.be.equal(expectedText);
    expect(result.data.contentType).to.be.equal('text/plain');
    expect(result.data.metadata).to.be.eql(expectedMetadata);
    expect(result.data.description).to.be.equal('test description');
    expect(result.data.name).to.be.equal('test name');
  }).timeout(10000);

  it('should download file upload', async () => {
    const transactionHash = TestDataRepository.getData(
      'shouldUploadFile',
      'transactionHash'
    );
    const expectedBuffer = await StreamHelper.stream2Buffer(
      fs.createReadStream('./e2e/testresources/test_pdf_file_2.pdf')
    );

    const param = DownloadParameter.create(transactionHash).build();

    const result = await downloader.download(param);
    const actual = await result.data.getContentAsBuffer();

    expect(actual).to.be.eql(expectedBuffer);
    expect(result.data.contentType).to.be.undefined;
    expect(result.data.metadata).to.be.undefined;
    expect(result.data.description).to.be.undefined;
    expect(result.data.name).to.be.undefined;
  }).timeout(10000);

  it('should download file upload with complete details', async () => {
    const transactionHash = TestDataRepository.getData(
      'shouldUploadFileWithCompleteDetails',
      'transactionHash'
    );
    const expectedBuffer = await StreamHelper.stream2Buffer(
      fs.createReadStream('./e2e/testresources/test_pdf_file_2.pdf')
    );
    const expectedMetadata = new Map<string, string>();
    expectedMetadata.set('author', 'Proximax');

    const param = DownloadParameter.create(transactionHash).build();

    const result = await downloader.download(param);
    const actual = await result.data.getContentAsBuffer();

    expect(actual).to.be.eql(expectedBuffer);
    expect(result.data.contentType).to.be.equal('application/pdf');
    expect(result.data.metadata).to.be.eql(expectedMetadata);
    expect(result.data.description).to.be.equal('test description');
    expect(result.data.name).to.be.equal('test name');
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

    const param = DownloadParameter.create(transactionHash).build();

    const result = await downloader.download(param);
    const actual = await result.data.getContentAsBuffer();

    expect(actual).to.be.eql(expectedBuffer);
    expect(result.data.contentType).to.be.undefined;
    expect(result.data.metadata).to.be.undefined;
    expect(result.data.description).to.be.undefined;
    expect(result.data.name).to.be.undefined;
  }).timeout(10000);

  it('should download url resource upload with complete details', async () => {
    const transactionHash = TestDataRepository.getData(
      'shouldUploadUrlResourceWithCompleteDetails',
      'transactionHash'
    );
    const urlReadableStream = await StreamHelper.urlReadableStream(
      'https://proximax.io/wp-content/uploads/2018/03/ProximaX-logotype.png'
    );
    const expectedBuffer = await StreamHelper.stream2Buffer(urlReadableStream);
    const expectedMetadata = new Map<string, string>();
    expectedMetadata.set('author', 'Proximax');

    const param = DownloadParameter.create(transactionHash).build();

    const result = await downloader.download(param);
    const actual = await result.data.getContentAsBuffer();

    expect(actual).to.be.eql(expectedBuffer);
    expect(result.data.contentType).to.be.equal('image/png');
    expect(result.data.metadata).to.be.eql(expectedMetadata);
    expect(result.data.description).to.be.equal('test description');
    expect(result.data.name).to.be.equal('test name');
  }).timeout(10000);

  it('should download string upload', async () => {
    const transactionHash = TestDataRepository.getData(
      'shouldUploadString',
      'transactionHash'
    );
    const expectedText = 'the quick brown fox jumps over the lazy dog';

    const param = DownloadParameter.create(transactionHash).build();

    const result = await downloader.download(param);
    const actual = await result.data.getContentsAsString();

    expect(actual).to.be.equal(expectedText);
    expect(result.data.contentType).to.be.undefined;
    expect(result.data.metadata).to.be.undefined;
    expect(result.data.description).to.be.undefined;
    expect(result.data.name).to.be.undefined;
  }).timeout(10000);

  it('should download string upload with complete details', async () => {
    const transactionHash = TestDataRepository.getData(
      'shouldUploadStringWithCompleteDetails',
      'transactionHash'
    );
    const expectedText = 'the quick brown fox jumps over the lazy dog';
    const expectedMetadata = new Map<string, string>();
    expectedMetadata.set('author', 'Proximax');

    const param = DownloadParameter.create(transactionHash).build();

    const result = await downloader.download(param);
    const actual = await result.data.getContentsAsString();

    expect(actual).to.be.equal(expectedText);
    expect(result.data.contentType).to.be.equal('text/plain');
    expect(result.data.metadata).to.be.eql(expectedMetadata);
    expect(result.data.description).to.be.equal('test description');
    expect(result.data.name).to.be.equal('test name');
  }).timeout(10000);

  it('should download readable stream upload', async () => {
    const transactionHash = TestDataRepository.getData(
      'shouldUploadReadableStream',
      'transactionHash'
    );
    const expectedText = 'readable stream is awesome';

    const param = DownloadParameter.create(transactionHash).build();

    const result = await downloader.download(param);
    const actual = await result.data.getContentsAsString();

    expect(actual).to.be.equal(expectedText);
    expect(result.data.contentType).to.be.undefined;
    expect(result.data.metadata).to.be.undefined;
    expect(result.data.description).to.be.undefined;
    expect(result.data.name).to.be.undefined;
  }).timeout(10000);

  it('should download readable stream upload with complete details', async () => {
    const transactionHash = TestDataRepository.getData(
      'shouldUploadReadableStreamWithCompleteDetails',
      'transactionHash'
    );
    const expectedText = 'readable stream is awesome';
    const expectedMetadata = new Map<string, string>();
    expectedMetadata.set('author', 'Proximax');

    const param = DownloadParameter.create(transactionHash).build();

    const result = await downloader.download(param);
    const actual = await result.data.getContentsAsString();

    expect(actual).to.be.equal(expectedText);
    expect(result.data.contentType).to.be.equal('text/plain');
    expect(result.data.metadata).to.be.eql(expectedMetadata);
    expect(result.data.description).to.be.equal('test description');
    expect(result.data.name).to.be.equal('test name');
  }).timeout(10000);
});
