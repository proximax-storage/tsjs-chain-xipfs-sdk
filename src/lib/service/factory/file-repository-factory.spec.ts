import { expect } from 'chai';
import 'mocha';
import { IpfsInfo, StorageInfo } from '../../config/testconfig';
import { IpfsConnection } from '../../connection/ipfs-connection';
import { Protocol } from '../../connection/protocol';
import { StorageConnection } from '../../connection/storage-connection';
import { IpfsClient } from '../client/ipfs-client';
import { StorageNodeClient } from '../client/storage-node-client';
import { FileRepositoryFactory } from './file-repository-factory';

describe('FileRepositoryFactory', () => {
  it('should create the ipfs client by the connnection config', () => {
    const ipfsClient = FileRepositoryFactory.create(
      new IpfsConnection(IpfsInfo.host, IpfsInfo.port)
    );

    expect(ipfsClient).to.be.a.instanceof(IpfsClient);
  });

  it('should create the storage node by the connnection config', () => {
    const storageConnection = FileRepositoryFactory.create(
      new StorageConnection(
        StorageInfo.apiHost,
        StorageInfo.apiPort,
        Protocol.HTTP,
        StorageInfo.bearerToken,
        StorageInfo.address
      )
    );

    expect(storageConnection).to.be.a.instanceof(StorageNodeClient);
  });
});
