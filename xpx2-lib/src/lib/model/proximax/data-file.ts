import { PrivacyStrategyType } from '../privacy/privacy-strategy-type';

export class ProximaxDataFile {
  constructor(
    public dataHash: string,
    public contentType?: string,
    public privacyType?: PrivacyStrategyType
  ) {}
}
