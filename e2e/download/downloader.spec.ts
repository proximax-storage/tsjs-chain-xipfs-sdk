import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
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
});
