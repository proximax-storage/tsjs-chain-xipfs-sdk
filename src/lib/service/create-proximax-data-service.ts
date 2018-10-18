import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConnectionConfig } from '../connection/connection-config';
import { DigestUtils } from '../helper/digest-util';
import { ProximaxDataModel } from '../model/proximax/data-model';
import { AbstractByteStreamParameterData } from '../upload/abstract-byte-stream-parameter-data';
import { UploadParameter } from '../upload/upload-parameter';
import { FileUploadService } from './file-upload-service';

/**
 * The service class responsible for creating the uploaded data object
 */
export class CreateProximaxDataService {
  private readonly fileUploadService: FileUploadService;

  /**
   * Construct this class
   *
   * @param connectionConfig the connection config
   */
  constructor(public readonly connectionConfig: ConnectionConfig) {
    this.fileUploadService = new FileUploadService(connectionConfig);
  }

  /**
   * Creates the uploaded data object
   *
   * @param uploadParam the upload parameter
   * @return the uploaded data object
   */
  public createData(param: UploadParameter): Observable<ProximaxDataModel> {
    if (param === null) {
      throw new Error('upload parameter is required');
    }

    if (param.data instanceof AbstractByteStreamParameterData) {
      const byteStreamParamData = param.data as AbstractByteStreamParameterData;
      return this.uploadByteStream(byteStreamParamData, param);
    } else if (param.data instanceof AbstractByteStreamParameterData) {
      // TODO
      return of(new ProximaxDataModel('replaceme'));
    } else {
      throw new Error(`Uploading of type ${param.data.type} is not supported`);
    }
  }

  private uploadByteStream(
    byteStreamParamData: AbstractByteStreamParameterData,
    param: UploadParameter
  ): Observable<ProximaxDataModel> {
    const contentType = this.detectContentType(param, byteStreamParamData);
    const encryptedData = param.privacyStrategy.encrypt(
      byteStreamParamData.getByteStream()
    );
    const digest = this.computeDigest(param.computeDigest, encryptedData);

    return this.fileUploadService.uploadStream(encryptedData).pipe(
      map(fur => {
        return new ProximaxDataModel(
          fur.hash,
          digest,
          param.data.description,
          contentType,
          param.data.metadata,
          param.data.name,
          fur.timestamp
        );
      })
    );
  }

  private detectContentType(
    param: UploadParameter,
    paramData: AbstractByteStreamParameterData
  ): string {
    return (
      paramData.contentType &&
      param.detectContentType &&
      this.detectFileType(paramData)
    );
  }

  private detectFileType(paramData: AbstractByteStreamParameterData) {
    const fileType = require('file-type');
    const mimeType = fileType(paramData.getByteStream());
    return mimeType && mimeType.mime;
  }

  private computeDigest(
    computeDigest: boolean,
    encryptedData: Uint8Array
  ): string | undefined {
    return computeDigest ? DigestUtils.computeDigest(encryptedData) : undefined;
  }
}
