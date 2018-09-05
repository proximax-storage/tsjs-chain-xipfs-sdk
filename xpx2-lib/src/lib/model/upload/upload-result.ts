import { PrivacyType } from '../privacy/privacy-type';
import { IpfsDataInfo } from '../proximax/ipfs-data-info';

export class UploadResult {
  constructor(
    public transactionHash: string,
    public privacyType?: PrivacyType,
    public version?: string,
    public data?: IpfsDataInfo
  ) {}
}
