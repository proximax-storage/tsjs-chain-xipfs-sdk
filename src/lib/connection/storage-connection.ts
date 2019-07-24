import { UriBuilder } from 'uribuilder';
import { FileStorageConnection } from './file-storage-connection';

export class StorageConnection extends FileStorageConnection {
  private apiUrl: string;

  constructor(
    public apiHost: string,
    public apiPort: number,
    public apiProtocol: string,
    public bearerToken: string,
    public nemAddress: string
  ) {
    super();
    const builder = new UriBuilder();
    builder.schema = apiProtocol;
    builder.host = apiHost;
    builder.port = apiPort;
    this.apiUrl = builder.toString();
  }

  public getApiUrl(): string {
    return this.apiUrl;
  }
}
