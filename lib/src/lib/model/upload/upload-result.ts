import { UploadResultRootData } from './upload-result-root-data';

export interface UploadResult {
  transactionHash: string;
  digest: string;
  rootDataHash: string;
  rootData: UploadResultRootData;
}
