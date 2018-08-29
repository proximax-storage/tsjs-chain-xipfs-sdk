import { FileContent } from './file-content';

export interface DataFile {
  description?: string;
  data?: FileContent;
  name?: string;
  contentType?: string;
  metadata?: Map<string, object>;
  hash?: string;
  path?: string;
  timestamp?: number;
  digest?: string;
}
