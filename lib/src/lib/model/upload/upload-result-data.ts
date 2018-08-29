export interface UploadResultData {
  digest: string;
  dataHash: string;
  description?: string;
  name?: string;
  contentType?: string;
  metadata?: Map<any, any>;
  timestamp?: number;
}
