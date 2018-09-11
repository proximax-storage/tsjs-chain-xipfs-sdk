import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IpfsConnection } from '../../connection/ipfs-connection';
import { IpfsContent } from '../../model/ipfs/ipfs-content';
import { IpfsNetworkInfo } from '../../model/ipfs/ipfs-network-info';
import { IpfsVersion } from '../../model/ipfs/ipfs-version';

export class IpfsClient {
  private connection: IpfsConnection;

  constructor(connection: IpfsConnection) {
    this.connection = connection;
  }

  public isConnect(): Observable<IpfsNetworkInfo> {
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
  }

  public addStream(data: any, options?: object): Observable<string> {
    if (!data) {
      throw new Error('data is required');
    }

    return from<IpfsContent[]>(
      this.connection.getAPI().files.add(data, options)
    ).pipe(map(hashList => hashList[0].hash));
  }

  /*
  public getStream(hash:string): Observable<Buffer> {
      if(!hash) {
          throw new Error('hash is required');
      }

     
  }*/
}
