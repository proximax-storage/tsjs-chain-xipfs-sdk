import { ProximaxRootDataModel } from './root-data-model';

export class ProximaxUploadResult {
  constructor(
    public readonly transactionHash?: string,
    public readonly rootDataHash?: string,
    public readonly digest?: string,
    public readonly rootData?: ProximaxRootDataModel
  ) {}
}
