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
import { BlockchainInfo, IpfsInfo } from '../integrationtestconfig';
import { TestDataRepository } from '../testdatarepository';

chai.use(chaiAsPromised);

describe('Downloader integration tests for direct download with digest validation', () => {
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

  it('should direct download with transaction hash and enabled validate digest', async () => {
    const transactionHash = TestDataRepository.getData(
      'shouldUploadWithEnabledComputeDigest',
      'transactionHash'
    );
    const expectedText = 'Proximax P2P Uploader for string test';

    const param = DirectDownloadParameter.createFromTransactionHash(
      transactionHash,
      undefined,
      true
    ).build();

    const resultStream = await downloader.directDownload(param);
    const actual = await StreamHelper.stream2String(resultStream);

    expect(actual).to.be.equal(expectedText);
  }).timeout(10000);

  it('should direct download with transaction hash and disabled validate digest', async () => {
    const transactionHash = TestDataRepository.getData(
      'shouldUploadWithEnabledComputeDigest',
      'transactionHash'
    );
    const expectedText = 'Proximax P2P Uploader for string test';

    const param = DirectDownloadParameter.createFromTransactionHash(
      transactionHash,
      undefined,
      false
    ).build();

    const resultStream = await downloader.directDownload(param);
    const actual = await StreamHelper.stream2String(resultStream);

    expect(actual).to.be.equal(expectedText);
  }).timeout(10000);

  it('should direct download with data hash and digest to validate', async () => {
    const dataHash = TestDataRepository.getData(
      'shouldUploadWithEnabledComputeDigest',
      'dataHash'
    );
    const digest = TestDataRepository.getData(
      'shouldUploadWithEnabledComputeDigest',
      'digest'
    );
    const expectedText = 'Proximax P2P Uploader for string test';

    const param = DirectDownloadParameter.createFromDataHash(
      dataHash,
      digest
    ).build();

    const resultStream = await downloader.directDownload(param);
    const actual = await StreamHelper.stream2String(resultStream);

    expect(actual).to.be.equal(expectedText);
  }).timeout(10000);

  it('should direct download with data hash and without digest', async () => {
    const dataHash = TestDataRepository.getData(
      'shouldUploadWithEnabledComputeDigest',
      'dataHash'
    );
    const expectedText = 'Proximax P2P Uploader for string test';

    const param = DirectDownloadParameter.createFromDataHash(dataHash).build();

    const resultStream = await downloader.directDownload(param);
    const actual = await StreamHelper.stream2String(resultStream);

    expect(actual).to.be.equal(expectedText);
  }).timeout(10000);
});
