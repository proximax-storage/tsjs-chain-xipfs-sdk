
import { PrivacyType } from '../privacy/privacy-type';
import { ProximaxDataModel } from './data-model';

export class ProximaxMessagePayloadModel {
  constructor(
    public readonly privacyType: PrivacyType,
    public readonly version:string,
    public readonly data: ProximaxDataModel
     
  ) {}
}
