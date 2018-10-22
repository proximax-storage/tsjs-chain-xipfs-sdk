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

chai.use(chaiAsPromised);

describe('Downloader integration tests for digest validation', () => {
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

  it('should download and enabled validate digest', async () => {
    const transactionHash =
      '74B5B26AD0CA967F136B808CF41FEDA6D196E52810144AFBE08921A96B52489E';
    const expectedText = 'Proximax P2P Uploader for string test';

    const param = DownloadParameter.create(transactionHash)
      .withValidateDigest(true)
      .build();

    const result = await downloader.download(param);
    const actual = await result.data.getContentsAsString();

    expect(actual).to.be.equal(expectedText);
  }).timeout(10000);

  it('should download and disabled validate digest', async () => {
    const transactionHash =
      '74B5B26AD0CA967F136B808CF41FEDA6D196E52810144AFBE08921A96B52489E';
    const expectedText = 'Proximax P2P Uploader for string test';

    const param = DownloadParameter.create(transactionHash)
      .withValidateDigest(true)
      .build();

    const result = await downloader.download(param);
    const actual = await result.data.getContentsAsString();

    expect(actual).to.be.equal(expectedText);
  }).timeout(10000);
});
