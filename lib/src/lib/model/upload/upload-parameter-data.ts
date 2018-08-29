export interface UploadParameterData {
  data?: ArrayBuffer;
  path?: string;
  description?: string;
  name?: string;
  contentType?: string;
  metadata?: Map<string, object>;
}
