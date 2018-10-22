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

chai.use(chaiAsPromised);

describe('Downloader integration tests', () => {
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

  it('should download content based on transaction hash', async () => {
    const transactionHash =
      'BDD4E36A29E2EF588FFEE6F6ABBC9EBC69F4DD3FCB8A8CD23C0A227A59B64D0D';

    const expectedText = 'Proximax P2P Uploader test';

    const param = DownloadParameter.create(transactionHash).build();

    const result = await downloader.download(param);
    const actual = await result.data.getContentsAsString();

    expect(actual).to.be.equal(expectedText);
  }).timeout(10000);

  it('should download uint8array upload', async () => {
    const transactionHash =
      '14FEB7849A910B10075030BEB2F5276322AEBD7EC0CB88D1E9E765A8EF793125';

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
    const transactionHash =
      'BFACB1E3D5ADBB6555F44C0C76177535B19E09B8805C9CAFE6CC6B8D330690CB';

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
    const transactionHash =
      '5605CA0590C2ADC5527276534FC56B16070EAF8373DA038A5C5D7EF154C7E42D';

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
    const transactionHash =
      'FC077BDDF12139359812CD70F75C0B9CD1CBE4DBC32DA578484E24E0810EEDD2';

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
    const transactionHash =
      '98FC1EB6373CB72BA06F229C1B5A4C92654217500AA4380C164D1C3CFCF4EC8D';

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
    const transactionHash =
      'D198619E43EB7AC9EBDD78607CE442EAB130BC71933F2960F938877AED2CC5E1';

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
    const transactionHash =
      'E8F295D6D96200A2684FE42B359C92AF3763BE0A5B699595D2DC64B00E8E609A';

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
    const transactionHash =
      '440A55C3D942064A92428B778CAC36C56179801546D2886FB4B3F13581C53520';

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
});
