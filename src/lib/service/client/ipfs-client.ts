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

import { from, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Stream } from 'stream';
import { IpfsConnection } from '../../connection/ipfs-connection';
import { IpfsContent } from '../../model/ipfs/ipfs-content';
import { FileRepository } from '../repository/file-repository';

/**
 * The client class that directly interface with IPFS using their SDK
 * <br>
 * <br>
 * This class delegates to IPFS the following:
 * <ul>
 * <li>adding of file(represented as byte arrays) and returning the hash for it</li>
 * <li>retrieving of file given a hash</li>
 * </ul>
 */
export class IpfsClient implements FileRepository {
  /**
   * Construct the class with IPFSConnection
   *
   * @param ipfsConnection the Ipfs connection
   */
  constructor(private readonly ipfsConnection: IpfsConnection) {}

  /**
   * Add/Upload a file (represented as byte stream) to IPFS
   * <br>
   * <br>
   * This method is equivalent to `ipfs add` CLI command
   *
   * @return the hash (base58) for the data uploaded
   */
  public addStream(stream: Stream): Observable<string> {
    if (!stream) {
      throw new Error('stream is required');
    }

    return from<IpfsContent[]>(
      this.ipfsConnection.getIpfs().files.add(stream, { pin: true })
    ).pipe(map(hashList => hashList[0].hash));
  }

  /**
   * Retrieves the file stream from IPFS given a hash
   * <br>
   * <br>
   * This method is equivalent to `ipfs cat` CLI command
   *
   * @param dataHash the hash (base58) of an IPFS file
   * @return the file (represented as byte stream)
   */
  public getStream(dataHash: string): Observable<Stream> {
    if (!dataHash) {
      throw new Error('dataHash is required');
    }

    return of(this.ipfsConnection.getIpfs().files.catReadableStream(dataHash));
  }
}
