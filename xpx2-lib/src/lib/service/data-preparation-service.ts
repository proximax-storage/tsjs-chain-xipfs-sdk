import { from, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { IpfsConnection } from '../connection/ipfs-connection';
import { IpfsContent } from '../model/ipfs/ipfs-content';
import { PrivacyStrategyType } from '../model/privacy/privacy-strategy-type';
import { ProximaxDataModel } from '../model/proximax/data-model';
import { ProximaxMessagePayloadModel } from '../model/proximax/message-payload';
import { ProximaxRootDataModel } from '../model/proximax/root-data-model';

export class DataPreparationService {
  private pullStream: any;

  constructor(public readonly ipfsConnection: IpfsConnection) {
    this.pullStream = require('pull-stream');
  }

  public createProximaxMessagePayloadModel(
    rootDataModel: ProximaxRootDataModel,
    computeDigest?: boolean,
    options?: any
  ): Observable<ProximaxMessagePayloadModel> {
    const localData = this.pullStream.values([
      Buffer.from(JSON.stringify(rootDataModel))
    ]);

    return from<IpfsContent[]>(
      this.ipfsConnection.getAPI().files.add(localData, options)
    ).pipe(
      map(res => {
        // ignore for now
        const digest = computeDigest ? 'not yet implement' : '';

        return new ProximaxMessagePayloadModel(
          digest,
          res[0].hash,
          rootDataModel.privacyType,
          rootDataModel.privacySearchTag,
          rootDataModel.description,
          rootDataModel.version
        );
      })
    );
  }

  public createProximaxRootDataModel(
    description?: string,
    privacyType?: PrivacyStrategyType,
    privacySearchTags?: string,
    version?: string,
    dataList?: ProximaxDataModel[]
  ): Observable<ProximaxRootDataModel> {
    const dm = new ProximaxRootDataModel(
      description,
      privacyType,
      privacySearchTags,
      version,
      dataList
    );

    return of(dm);
  }

  public createProximaxDataModel(
    data: any,
    name?: string,
    description?: string,
    contentType?: string,
    computeDigest?: boolean,
    metadata?: Map<any, any>,
    options?: any
  ): Observable<ProximaxDataModel> {
    const localData = this.pullStream.values([Buffer.from(data)]);

    return from<IpfsContent[]>(
      this.ipfsConnection.getAPI().files.add(localData, options)
    ).pipe(
      map(res => {
        // ignore for now
        const digest = computeDigest ? 'not yet implement' : '';

        return new ProximaxDataModel(
          digest,
          res[0].hash,
          description,
          contentType,
          metadata,
          name,
          Date.now()
        );
      })
    );
  }
}
