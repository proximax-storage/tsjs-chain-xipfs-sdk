import { ProximaxDataFile } from './data-file';

export class ProximaxDataPayload {
  constructor(
    public readonly name?: string,
    public readonly description?: string,
    public readonly digest?: string,
    public readonly metadata?: Map<string, object>,
    public readonly data?: ProximaxDataFile[],
    public readonly timestamp?: number
  ) {}
}
