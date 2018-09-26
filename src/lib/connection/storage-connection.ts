import { UriBuilder } from 'uribuilder';
export class StorageConnection {
    private apiUrl;

    constructor(public apiHost: string,
        public apiPort: number,
        public apiProtocol: string,
        public bearerToken: string,
        public nemAddress: string
    ) { 
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