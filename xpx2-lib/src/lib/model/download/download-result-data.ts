import { DataInfo } from '../proximax/data-info';

export class DownloadResultData extends DataInfo {
  constructor(
    public readonly data: any,
    public readonly digest: string,
    public readonly dataHash: string,
    public readonly timestamp: number,
    public readonly description?: string,
    public readonly contentType?: string,
    public readonly name?: string,
    public readonly metadata?: Map<string, object>
  ) {
    super(description, contentType, metadata, name);
  }
}
