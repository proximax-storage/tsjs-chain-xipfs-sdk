import { PrivacyStrategyType } from '../privacy/privacy-strategy-type';
import { UploadParameterData } from './upload-parameter-data';

export interface UploadParameter {
  computeDigest?: boolean;
  privacyStrategy: PrivacyStrategyType;
  signerPrivateKey: string;
  recipientPublicKey: string;
  description?: string;
  dataList: UploadParameterData[];
}
