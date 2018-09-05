export class DataInfo {
  constructor(
    public description?: string,
    public contentType?: string,
    public metadata?: Map<string, object>,
    public name?: string
  ) {}
}
