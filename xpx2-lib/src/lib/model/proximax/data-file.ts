import { PrivacyStrategyType } from '../privacy/privacy-strategy-type';

export class ProximaxDataFile {
  constructor(
    public readonly dataHash: string,
    public readonly contentType?: string,
    public readonly privacyType?: PrivacyStrategyType
  ) {}
}
