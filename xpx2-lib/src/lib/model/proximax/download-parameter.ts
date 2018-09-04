import { PrivacyType } from '../privacy/privacy-type';

export class ProximaxDownloadParameter {
  constructor(
    public transactionHash: string,
    public accountPrivateKey?: string,
    public privacyStrategy?: PrivacyType,
    public validateDigest?: boolean
  ) {}
}
