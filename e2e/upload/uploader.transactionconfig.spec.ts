import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import 'mocha';
import { BlockchainInfo, IpfsInfo } from '../../src/lib/config/config.spec';
import { BlockchainNetworkConnection } from '../../src/lib/connection/blockchain-network-connection';
import { ConnectionConfig } from '../../src/lib/connection/connection-config';
import { IpfsConnection } from '../../src/lib/connection/ipfs-connection';
import { Protocol } from '../../src/lib/connection/protocol';
import { BlockchainNetworkType } from '../../src/lib/model/blockchain/blockchain-network-type';
import { UploadParameter } from '../../src/lib/upload/upload-parameter';
import { Uploader } from '../../src/lib/upload/uploader';
import { NoFundsAccount } from '../integrationtestconfig';

chai.use(chaiAsPromised);

describe('Uploader integration tests for transaction config', () => {
  it('should fail on insufficient funds', async () => {
    const connectionConfig = ConnectionConfig.createWithLocalIpfsConnection(
      new BlockchainNetworkConnection(
        BlockchainNetworkType.MIJIN_TEST,
        BlockchainInfo.apiHost,
        BlockchainInfo.apiPort,
        Protocol.HTTP
      ),
      new IpfsConnection(IpfsInfo.multiaddress, IpfsInfo.port)
    );

    const byteStream = new Uint8Array(
      Buffer.from('Proximax P2P Uploader test')
    );

    const param = UploadParameter.createForUint8ArrayUpload(
      byteStream,
      NoFundsAccount.privateKey
    ).build();

    const uploader = new Uploader(connectionConfig);

    expect(uploader.upload(param)).to.be.rejectedWith(Error);
  }).timeout(10000);
});
