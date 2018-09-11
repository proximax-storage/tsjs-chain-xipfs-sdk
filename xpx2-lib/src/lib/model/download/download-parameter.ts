import { PrivacyType } from '../privacy/privacy-type';

export class DownloadParameter {
  constructor(
    public readonly transactionHash: string,
    public readonly accountPrivateKey: string,
    public readonly privacyStrategy?: PrivacyType,
    public readonly validateDigest?: boolean
  ) {}
}
