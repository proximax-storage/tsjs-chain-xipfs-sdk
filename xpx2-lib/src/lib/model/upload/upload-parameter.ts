import { KeyPair } from '../common/keypair';
import { ProximaxDataPayload } from '../proximax/data-payload';

export interface UploadParameter {
  dataPayload: ProximaxDataPayload;
  keyPair?: KeyPair;
  secureProvider?: string;
}
