import { DataInfo } from '../proximax/data-info';

export class UploadParameterData extends DataInfo {
  constructor(
    public byteStreams: any,
    public path?: string,
    public options?: object,
    public description?: string,
    public contentType?: string,
    public metadata?: Map<string, object>,
    public name?: string
  ) {
    super(description, contentType, metadata, name);
  }
}
