/**
 * Class represents the ipfs connection
 */
export class IpfsConnection {
  private API: any;

  /**
   * Constructor
   * @param host the ifps host
   * @param port the ipfs port
   * @param options the protocol options e.g. { protocol: 'http' }
   */
  constructor(
    public readonly host: string,
    public readonly port?: string,
    public readonly options?: object
  ) {
    const API = require('ipfs-api');
    this.API = new API(host, port, options);
  }

 /**
  * Return instance of ipfs api
  */
  public getAPI() {
    return this.API;
  }
}
