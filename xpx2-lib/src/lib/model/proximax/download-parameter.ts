import { PrivacyStrategyType } from '../privacy/privacy-strategy-type';

export class ProximaxDownloadParameter {
  constructor(
    public transactionHash: string,
    public accountPrivateKey?: string,
    public privacyStrategy?: PrivacyStrategyType,
    public validateDigest?: boolean
  ) {}
}
