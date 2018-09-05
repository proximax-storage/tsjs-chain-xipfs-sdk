import { DataInfo } from './data-info';

export class IpfsDataInfo extends DataInfo {
  constructor(public dataHash?: string, public timestamp?: number) {
    super();
  }
}
