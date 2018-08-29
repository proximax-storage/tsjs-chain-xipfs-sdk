import { from, Observable } from 'rxjs';
import { Version } from '../model/ipfs/version';

export class IpfsConnection {
  private API: any;

  constructor(host: string, port?: string, options?: object) {
    const API = require('ipfs-api');
    this.API = new API(host, port, options);
  }

  public verifyConnection(): Observable<Version> {
    return from(this.API.version());
  }

  public getAPI() {
    return this.API;
  }
}
