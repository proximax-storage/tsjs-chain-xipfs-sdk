import { PrivacyStrategyType } from '../privacy/privacy-strategy-type';
import { ProximaxDataModel } from './data-model';

export class ProximaxRootDataModel {
  constructor(
    public readonly description?: string,
    public readonly privacyType?: PrivacyStrategyType,
    public readonly privacySearchTag?: string,
    public readonly version?: string,
    public readonly datalist?: ProximaxDataModel[]
  ) {}
}
