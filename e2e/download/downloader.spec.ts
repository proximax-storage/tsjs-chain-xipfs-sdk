import { expect } from 'chai';
import 'mocha';
import {
  BlockchainInfo,
  IpfsInfo,
  SenderAccount
} from '../../src/lib/config/config.spec';
import { BlockchainNetworkConnection } from '../../src/lib/connection/blockchain-network-connection';
import { ConnectionConfig } from '../../src/lib/connection/connection-config';
import { IpfsConnection } from '../../src/lib/connection/ipfs-connection';
import { Protocol } from '../../src/lib/connection/protocol';
import { DownloadParameter } from '../../src/lib/download/download-parameter';
import { Downloader } from '../../src/lib/download/downloader';
import { Converter } from '../../src/lib/helper/converter';
import { BlockchainNetworkType } from '../../src/lib/model/blockchain/blockchain-network-type';

describe('Downloader', () => {
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

    const downloader = new Downloader(connectionConfig);

    const paramBuilder = DownloadParameter.create(transactionHash);
    paramBuilder.withPlainPrivacy();
    const param = paramBuilder.build();

    await downloader.download(param).then(response => {
      // console.log(response);

      const data = response.data.bytes;
      // console.log(data);
      const actual = Converter.ab2str(data);
      // console.log(actual);
      expect(actual).to.be.equal(expectedText);
    });
  }).timeout(10000);

  // TODO Fix code
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
      '3E27BB74E076E5E3FBF89D204CE738862B7B3100E2B5D979E7210A92846EA572';

    const expectedText = 'Proximax P2P Uploader with secured message';

    const downloader = new Downloader(connectionConfig);

    const paramBuilder = DownloadParameter.create(transactionHash);
    paramBuilder.withAccountPrivateKey(SenderAccount.privateKey);
    paramBuilder.withPlainPrivacy();
    const param = paramBuilder.build();

    await downloader.download(param).then(response => {
      // console.log(response);

      const data = response.data.bytes;
      // console.log(data);
      const actual = Converter.ab2str(data);
      // console.log(actual);
      expect(actual).to.be.equal(expectedText);
    });
  }).timeout(10000);
});
