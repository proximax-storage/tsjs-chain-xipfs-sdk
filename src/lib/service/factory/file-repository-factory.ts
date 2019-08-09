
import { FileStorageConnection } from '../../connection/file-storage-connection';
import { IpfsConnection } from '../../connection/ipfs-connection';
import { StorageConnection } from '../../connection/storage-connection';
import { IpfsClient } from '../client/ipfs-client';
import { StorageNodeClient } from '../client/storage-node-client';
import { FileRepository } from '../repository/file-repository';

/*
 * Copyright 2018 ProximaX Limited
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * The factory class to create the file storage client based on connection config
 */
export class FileRepositoryFactory {
  /**
   * Create the file storage client based on file storage
   *
   * @param fileStorageConnection the connection to file storage
   * @return the file storage client created
   */
  public static create(
    fileStorageConnection: FileStorageConnection
  ): FileRepository {
    if (fileStorageConnection instanceof IpfsConnection) {
      return new IpfsClient(fileStorageConnection as IpfsConnection);
    } else if (fileStorageConnection instanceof StorageConnection) {
      return new StorageNodeClient(fileStorageConnection as StorageConnection);
    } else {
      throw new Error('Unknown file storage connection %s');
    }
  }
}
