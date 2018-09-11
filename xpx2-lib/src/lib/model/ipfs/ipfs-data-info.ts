import { DataInfo } from '../proximax/data-info';

export class IpfsDataInfo extends DataInfo {
  constructor(public dataHash?: string, public timestamp?: number) {
    super();
  }
}
