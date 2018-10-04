import { expect } from 'chai';
import 'mocha';
import { BlockchainInfo, IpfsInfo } from '../config/config.spec';
import { BlockchainNetworkConnection } from '../connection/blockchain-network-connection';
import { ConnectionConfig } from '../connection/connection-config';
import { IpfsConnection } from '../connection/ipfs-connection';
import { Protocol } from '../connection/protocol';
import { BlockchainNetworkType } from '../model/blockchain/blockchain-network-type';
import { FileUploadService } from './file-upload-service';

describe('FileUploadService', () => {
  it('should upload content to file repository', async () => {
    const connectionConfig = ConnectionConfig.createWithLocalIpfsConnection(
      new BlockchainNetworkConnection(
        BlockchainNetworkType.MIJIN_TEST,
        BlockchainInfo.apiHost,
        BlockchainInfo.apiPort,
        Protocol.HTTP
      ),
      new IpfsConnection(IpfsInfo.multiaddress, IpfsInfo.port)
    );

    const fileRepo = new FileUploadService(connectionConfig);
    await fileRepo.uploadStream('Proximax P2P test').subscribe(fileResponse => {
      // console.log(hash);
      expect(fileResponse.hash).to.be.equal(
        'QmTjC5q7fFkUh4spfXjzfahWVfkLMLcnsbnQ7ZhZwCNfq6'
      );
    });
  });
});
