import { PrivacyStrategyType } from '../privacy/privacy-strategy-type';
import { UploadResultData } from './upload-result-data';

export interface UploadResultRootData {
  dataList: UploadResultData[];
  description?: string;
  privacyType: PrivacyStrategyType;
  privacySearchTag?: string;
  version?: string;
}
