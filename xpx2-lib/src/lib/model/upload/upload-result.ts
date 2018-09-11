import { IpfsDataInfo } from '../ipfs/ipfs-data-info';
import { PrivacyType } from '../privacy/privacy-type';

export class UploadResult {
  constructor(
    public transactionHash: string,
    public privacyType?: PrivacyType,
    public version?: string,
    public data?: IpfsDataInfo
  ) {}
}
