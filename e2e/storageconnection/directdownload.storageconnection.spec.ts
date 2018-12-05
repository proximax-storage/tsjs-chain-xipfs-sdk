import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import 'mocha';
import {BlockchainNetworkConnection, BlockchainNetworkType, StorageConnection} from '../../src/index';
import {ConnectionConfig} from '../../src/lib/connection/connection-config';
import {Protocol} from '../../src/lib/connection/protocol';
import {DirectDownloadParameter} from '../../src/lib/download/direct-download-parameter';
import {Downloader} from '../../src/lib/download/downloader';
import {StreamHelper} from '../../src/lib/helper/stream-helper';
import {BlockchainInfo, StorageNodeApi} from '../integrationtestconfig';
import {TestDataRepository} from '../testdatarepository';

chai.use(chaiAsPromised);

describe('Downloader direct download integration tests for storage connection', () => {
  const connectionConfig = ConnectionConfig.createWithStorageConnection(
    new BlockchainNetworkConnection(
      BlockchainNetworkType.MIJIN_TEST,
      BlockchainInfo.apiHost,
      BlockchainInfo.apiPort,
      Protocol.HTTP
    ),
    new StorageConnection(
      StorageNodeApi.apiHost,
      StorageNodeApi.apiPort,
      StorageNodeApi.apiProtocol,
      StorageNodeApi.bearerToken,
      StorageNodeApi.nemAddress
    )
  );
  const downloader = new Downloader(connectionConfig);

  it('should download from storage connection using transaction hash', async () => {
    const transactionHash = TestDataRepository.getData(
      'shouldUploadToStorageConnection',
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

  it('should download from storage connection using data hash', async () => {
    const dataHash = TestDataRepository.getData(
      'shouldUploadToStorageConnection',
      'dataHash'
    );
    const expectedText = 'the quick brown fox jumps over the lazy dog';

    const param = DirectDownloadParameter.createFromDataHash(dataHash).build();

    const resultStream = await downloader.directDownload(param);
    const actual = await StreamHelper.stream2String(resultStream);

    expect(actual).to.be.equal(expectedText);
  }).timeout(10000);
});
