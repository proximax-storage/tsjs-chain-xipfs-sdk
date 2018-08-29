export class ProximaxDataModel {
  constructor(
    public readonly digest?: string,
    public readonly dataHash?: string,
    public readonly description?: string,
    public readonly contentType?: string,
    public readonly metadata?: Map<string, object>,
    public readonly name?: string,
    public readonly timestamp?: number
  ) {}
}
