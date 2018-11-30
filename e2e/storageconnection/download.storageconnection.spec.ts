import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import 'mocha';
import {
  BlockchainNetworkConnection,
  BlockchainNetworkType,
  DownloadParameter,
  IpfsConnection
} from '../../src/index';
import { ConnectionConfig } from '../../src/lib/connection/connection-config';
import { Protocol } from '../../src/lib/connection/protocol';
import { Downloader } from '../../src/lib/download/downloader';
import { BlockchainInfo, IpfsInfo } from '../integrationtestconfig';
import { TestDataRepository } from '../testdatarepository';

chai.use(chaiAsPromised);

describe('Downloader download integration tests for storage connection', () => {
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

  it('should download from storage connection', async () => {
    const transactionHash = TestDataRepository.getData(
      'shouldUploadToStorageConnection',
      'transactionHash'
    );
    const expectedText = 'the quick brown fox jumps over the lazy dog';

    const param = DownloadParameter.create(transactionHash).build();

    const result = await downloader.download(param);

    expect(result.data.getContentsAsString()).to.be.equal(expectedText);
  }).timeout(10000);
});
