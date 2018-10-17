import { expect } from 'chai';
import 'mocha';
import {
  BlockchainInfo,
  IpfsInfo,
  RecipientAccount
} from '../config/config.spec';
import { BlockchainNetworkConnection } from '../connection/blockchain-network-connection';
import { ConnectionConfig } from '../connection/connection-config';
import { IpfsConnection } from '../connection/ipfs-connection';
import { Protocol } from '../connection/protocol';
import { Converter } from '../helper/converter';
import { BlockchainNetworkType } from '../model/blockchain/blockchain-network-type';
import { DownloadParameter } from './download-parameter';
import { Downloader } from './downloader';

describe('Downloader', () => {
  /* it('should download content based on transaction hash', async () => {
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
      '1740A84E9174418DFF451238CD065B14ED75EF97D5C8F1E6EA02D959B49934E7';

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
  });*/

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
      'D228AF0AAEEA6B8C8164DE18EE62A90A284DE8D2549D635FDD10EDAFA34AE955';

    const expectedText = 'Proximax P2P Uploader with secured message';

    const downloader = new Downloader(connectionConfig);

    const paramBuilder = DownloadParameter.create(transactionHash);
    paramBuilder.withAccountPrivateKey(RecipientAccount.privateKey);
    paramBuilder.withPlainPrivacy();
    const param = paramBuilder.build();

    await downloader.download(param).then(response => {
      // console.log(response);

      const data = response.data.bytes;
      // console.log(data);
      const actual = Converter.ab2str(data);
      // console.log(actual);
      expect(actual).to.be.equal(expectedText);
    }).timeout(10000);
  });
});
