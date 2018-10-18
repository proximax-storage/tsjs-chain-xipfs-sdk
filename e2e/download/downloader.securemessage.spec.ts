import { expect } from 'chai';
import 'mocha';
import { BlockchainNetworkConnection } from '../../src/lib/connection/blockchain-network-connection';
import { ConnectionConfig } from '../../src/lib/connection/connection-config';
import { IpfsConnection } from '../../src/lib/connection/ipfs-connection';
import { Protocol } from '../../src/lib/connection/protocol';
import { DownloadParameter } from '../../src/lib/download/download-parameter';
import { Downloader } from '../../src/lib/download/downloader';
import { Converter } from '../../src/lib/helper/converter';
import { BlockchainNetworkType } from '../../src/lib/model/blockchain/blockchain-network-type';
import {
  BlockchainInfo,
  IpfsInfo,
  SenderAccount
} from '../integrationtestconfig';

describe('Downloader integration tests for secure message', () => {
  it('should download content based on transaction hash', async () => {
    const connectionConfig = ConnectionConfig.createWithLocalIpfsConnection(
      new BlockchainNetworkConnection(
        BlockchainNetworkType.MIJIN_TEST,
        BlockchainInfo.apiHost,
        BlockchainInfo.apiPort,
        Protocol.HTTP
      ),
      new IpfsConnection(IpfsInfo.multiaddress, IpfsInfo.port)
    );

    const transactionHash =
      'BDD4E36A29E2EF588FFEE6F6ABBC9EBC69F4DD3FCB8A8CD23C0A227A59B64D0D';

    const expectedText = 'Proximax P2P Uploader test';

    const param = DownloadParameter.create(transactionHash).build();

    const downloader = new Downloader(connectionConfig);
    await downloader.download(param).then(response => {
      // console.log(response);

      const data = response.data.bytes;
      // console.log(data);
      const actual = Converter.ab2str(data);
      // console.log(actual);
      expect(actual).to.be.equal(expectedText);
    });
  }).timeout(10000);

  it('should download content based on transaction hash with secure message', async () => {
    const connectionConfig = ConnectionConfig.createWithLocalIpfsConnection(
      new BlockchainNetworkConnection(
        BlockchainNetworkType.MIJIN_TEST,
        BlockchainInfo.apiHost,
        BlockchainInfo.apiPort,
        Protocol.HTTP
      ),
      new IpfsConnection(IpfsInfo.multiaddress, IpfsInfo.port)
    );

    const transactionHash =
      'E01FFFA27BC1E7655348ABCFF626E8BC053E5F65A67740B0D22CD837740EB9D5';

    const expectedText = 'Proximax P2P Uploader with secured message';

    const param = DownloadParameter.create(transactionHash)
      .withAccountPrivateKey(SenderAccount.privateKey)
      .build();
    const downloader = new Downloader(connectionConfig);

    await downloader.download(param).then(response => {
      const data = response.data.bytes;
      const actual = Converter.ab2str(data);
      expect(actual).to.be.equal(expectedText);
    });
  }).timeout(10000);
});
