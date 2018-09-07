import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IpfsNetworkInfo } from '../model/ipfs/ipfs-network-info';
import { IpfsVersion } from '../model/ipfs/ipfs-version';

export class IpfsConnection {
  private API: any;

  constructor(
    public readonly host: string,
    public readonly port?: string,
    public readonly options?: object
  ) {
    const API = require('ipfs-api');
    this.API = new API(host, port, options);
  }

  public isConnect(): Observable<IpfsNetworkInfo> {
    return from<IpfsVersion>(this.API.version()).pipe(
      map(response => {
        if (!response) {
          return new IpfsNetworkInfo('Disconnected');
        }

        return new IpfsNetworkInfo(
          'Connected',
          response.version,
          response.repo
        );
      })
    );
  }

  public getAPI() {
    return this.API;
  }
}
