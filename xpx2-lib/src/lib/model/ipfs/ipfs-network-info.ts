export class IpfsNetworkInfo {
  constructor(
    public readonly network: string,
    public readonly port?: string,
    public readonly options?: object,
    public readonly status?: string,
    public readonly version?: string,
    public readonly repo?: string
  ) {}
}
