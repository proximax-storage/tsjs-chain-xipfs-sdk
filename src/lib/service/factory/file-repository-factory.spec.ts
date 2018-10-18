import { expect } from 'chai';
import 'mocha';
import { BlockchainInfo, IpfsInfo, StorageInfo } from '../../config/testconfig';
import { BlockchainNetworkConnection } from '../../connection/blockchain-network-connection';
import { ConnectionConfig } from '../../connection/connection-config';
import { IpfsConnection } from '../../connection/ipfs-connection';
import { Protocol } from '../../connection/protocol';
import { StorageConnection } from '../../connection/storage-connection';
import { BlockchainNetworkType } from '../../model/blockchain/blockchain-network-type';
import { IpfsClient } from '../client/ipfs-client';
import { StorageNodeClient } from '../client/storage-node-client';
import { FileRepositoryFactory } from './file-repository-factory';

describe('FileRepositoryFactory', () => {
  it('should create the ipfs client by the connnection config', () => {
    const ipfsClient = FileRepositoryFactory.createFromConnectionConfig(
      ConnectionConfig.createWithLocalIpfsConnection(
        new BlockchainNetworkConnection(
          BlockchainNetworkType.MIJIN_TEST,
          BlockchainInfo.apiHost,
          BlockchainInfo.apiPort,
          Protocol.HTTP
        ),
        new IpfsConnection(IpfsInfo.multiaddress, IpfsInfo.port)
      )
    );
    expect(ipfsClient).to.be.a.instanceof(IpfsClient);
  });

  it('should create the storage node by the connnection config', () => {
    const connectionConfig = ConnectionConfig.createWithStorageConnection(
      new BlockchainNetworkConnection(
        BlockchainNetworkType.MIJIN_TEST,
        BlockchainInfo.apiHost,
        BlockchainInfo.apiPort,
        Protocol.HTTP
      ),
      new StorageConnection(
        StorageInfo.apiHost,
        StorageInfo.apiPort,
        Protocol.HTTP,
        StorageInfo.bearerToken,
        StorageInfo.address
      )
    );
    // console.log(connectionConfig);
    const storageConnection = FileRepositoryFactory.createFromConnectionConfig(
      connectionConfig
    );
    // console.log(storageConnection);
    expect(storageConnection).to.be.a.instanceof(StorageNodeClient);
  });
});
