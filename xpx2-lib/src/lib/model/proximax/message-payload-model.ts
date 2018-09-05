import { PrivacyType } from '../privacy/privacy-type';
import { IpfsDataInfo } from './ipfs-data-info';

export class MessagePayloadModel {
  constructor(
    public data: IpfsDataInfo,
    public privacyType?: PrivacyType,
    public version?: string
  ) {}
}
