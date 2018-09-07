export class IpfsNetworkInfo {
  constructor(
    public readonly status?: string,
    public readonly version?: string,
    public readonly repo?: string
  ) {}
}
