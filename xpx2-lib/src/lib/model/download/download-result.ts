import { PrivacyType } from '../privacy/privacy-type';
import { DownloadResultData } from './download-result-data';

export class DownloadResult {
  constructor(
    public readonly transactionHash: string,
    public readonly privacyType: PrivacyType,
    public readonly version: string,
    public readonly data: DownloadResultData
  ) {}
}
