import { KeyPair } from '../common/keypair';
import { SecureType } from '../privacy/secure-type';
import { ProximaxDataPayload } from '../proximax/data-payload';

export interface ProximaxUploadParameter {
  dataPayload: ProximaxDataPayload;
  keyPair: KeyPair;
  secureType?: SecureType;
  version?: string;
}
