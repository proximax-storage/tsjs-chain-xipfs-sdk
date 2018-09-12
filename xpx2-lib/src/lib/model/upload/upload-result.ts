import { PrivacyType } from '../../privacy/privacy-type';
import { ProximaxDataModel } from '../proximax/data-model';

export class UploadResult {
  constructor(
    public transactionHash: string,
    public privacyType?: PrivacyType,
    public version?: string,
    public data?: ProximaxDataModel
  ) {}
}
