export class UploadParameterData {
  constructor(
    public byteStreams: any,
    public path?: string,
    public options?: object,
    public description?: string,
    public contentType?: string,
    public metadata?: Map<string, object>,
    public name?: string
  ) {}
}
