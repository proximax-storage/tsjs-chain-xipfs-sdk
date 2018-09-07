import { from, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { IpfsConnection } from '../connection/ipfs-connection';
import { IpfsContent } from '../model/ipfs/ipfs-content';
import { PrivacyType } from '../model/privacy/privacy-type';
import { ProximaxDataFile } from '../model/proximax/data-file';
import { ProximaxDataPayload } from '../model/proximax/data-payload';

export class DataService {
  private pullStream: any;

  constructor(public readonly ipfsConnection: IpfsConnection) {
    this.pullStream = require('pull-stream');
  }

  public createProximaxDataFile(
    data: any,
    contentType?: string,
    privacyType?: PrivacyType,
    options?: any
  ): Observable<ProximaxDataFile> {
    const localData = this.pullStream.values([Buffer.from(data)]);

    return from<IpfsContent[]>(
      this.ipfsConnection.getAPI().files.add(localData, options)
    ).pipe(
      map(res => {
        return new ProximaxDataFile(res[0].hash, contentType, privacyType);
      })
    );
  }

  public createProximaxDataPayload(
    name?: string,
    description?: string,
    metadata?: Map<string, object>,
    dataList?: ProximaxDataFile[],
    timestamp?: number
  ): Observable<ProximaxDataPayload> {
    const digest = ''; // to calculate digest
    const payload = new ProximaxDataPayload(
      name,
      description,
      digest,
      metadata,
      dataList,
      timestamp
    );
    return of(payload);
  }
}
