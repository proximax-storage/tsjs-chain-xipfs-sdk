import { SecureType } from '../privacy/secure-type';
import { ProximaxDataPayload } from './data-payload';

export class ProximaxUploadResult {
  constructor(
    public readonly transactionHash?: string,
    public readonly secureType?: SecureType,
    public readonly version?: string,
    public readonly data?: ProximaxDataPayload
  ) {}
}
