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
import { BlockchainInfo, IpfsInfo } from '../integrationtestconfig';
import { TestDataRepository } from '../testdatarepository';

chai.use(chaiAsPromised);

describe('Downloader integration tests for download with digest validation', () => {
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

  it('should download with enabled validate digest', async () => {
    const transactionHash = TestDataRepository.getData(
      'shouldUploadWithEnabledComputeDigest',
      'transactionHash'
    );
    const expectedText = 'Proximax P2P Uploader for string test';

    const param = DownloadParameter.create(transactionHash)
      .withValidateDigest(true)
      .build();

    const result = await downloader.download(param);
    const actual = await result.data.getContentsAsString();

    expect(actual).to.be.equal(expectedText);
  }).timeout(10000);

  it('should download with disabled validate digest', async () => {
    const transactionHash = TestDataRepository.getData(
      'shouldUploadWithEnabledComputeDigest',
      'transactionHash'
    );
    const expectedText = 'Proximax P2P Uploader for string test';

    const param = DownloadParameter.create(transactionHash)
      .withValidateDigest(true)
      .build();

    const result = await downloader.download(param);
    const actual = await result.data.getContentsAsString();

    expect(actual).to.be.equal(expectedText);
  }).timeout(10000);
});
