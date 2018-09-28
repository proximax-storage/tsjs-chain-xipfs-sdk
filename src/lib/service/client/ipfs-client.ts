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

import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IpfsConnection } from '../../connection/ipfs-connection';
import { IpfsContent } from '../../model/ipfs/ipfs-content';
import { FileRepository } from '../repository/file-repository';

/**
 * Class represents Ipfs client
 */
export class IpfsClient implements FileRepository {
  private connection: IpfsConnection;

  /**
   * Constructor
   * @param connection The ipfs connection
   */
  constructor(connection: IpfsConnection) {
    this.connection = connection;
  }

  /*public isConnect(): Observable<IpfsNetworkInfo> {
    return from<IpfsVersion>(this.connection.getAPI().version()).pipe(
      map(response => {
        if (!response) {
          return new IpfsNetworkInfo(
            this.connection.host,
            this.connection.port,
            this.connection.options,
            'Disconnected'
          );
        }

        return new IpfsNetworkInfo(
          this.connection.host,
          this.connection.port,
          this.connection.options,
          'Connected',
          response.version,
          response.repo
        );
      })
    );
  }*/

  /**
   * Add stream to ipfs storage
   * @param data the data
   * @param options the callback options
   */
  public addStream(data: any, options?: object): Observable<string> {
    if (!data) {
      throw new Error('data is required');
    }

    // convert to buffer
    const bufferData = Buffer.from(data);

    return from<IpfsContent[]>(
      this.connection.getIpfs().files.add(bufferData, options)
    ).pipe(map(hashList => hashList[0].hash));
  }

  /**
   * Gets stream from ipfs storage by datahash
   * @param hash the data hash
   */
  public getStream(hash: string): Observable<any> {
    if (!hash) {
      throw new Error('hash is required');
    }

    return from<IpfsContent>(this.connection.getIpfs().files.get(hash));
  }
}
