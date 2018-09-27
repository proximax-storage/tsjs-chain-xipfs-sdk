import { ConnectionConfig } from '../../connection/connection-config';
import { IpfsClient } from '../client/ipfs-client';
import { StorageNodeClient } from '../client/storage-node-client';
import { FileRepository } from '../repository/file-repository';
export class FileRepositoryFactory {
  public static createFromConnectionConfig(
    connectionConfig: ConnectionConfig
  ): FileRepository {
    if (connectionConfig.ifpsConnection !== null) {
      return new IpfsClient(connectionConfig.ifpsConnection!);
    } else {
      return new StorageNodeClient(connectionConfig.storageConnection!);
    }
  }
}
