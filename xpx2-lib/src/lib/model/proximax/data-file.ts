import { PrivacyType } from '../privacy/privacy-type';

export class ProximaxDataFile {
  constructor(
    public dataHash: string,
    public contentType?: string,
    public privacyType?: PrivacyType
  ) {}
}
