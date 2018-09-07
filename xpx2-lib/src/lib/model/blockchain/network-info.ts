export class NetworkInfo {
  constructor(
    public readonly networkType?: string,
    public readonly baseUrl?: string,
    public readonly gatewayUrl?: string,
    public readonly status?: string
  ) {}
}
