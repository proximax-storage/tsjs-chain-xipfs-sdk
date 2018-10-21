import { map } from 'rxjs/operators';
import { Stream } from 'stream';
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
  public async createData(param: UploadParameter): Promise<ProximaxDataModel> {
    if (param === null) {
      throw new Error('upload parameter is required');
    }

    if (param.data instanceof AbstractByteStreamParameterData) {
      const byteStreamParamData = param.data as AbstractByteStreamParameterData;
      return this.uploadByteStream(byteStreamParamData, param);
    } else if (param.data instanceof AbstractByteStreamParameterData) {
      // TODO
      return new ProximaxDataModel('replaceme');
    } else {
      throw new Error(`Uploading of type ${param.data.type} is not supported`);
    }
  }

  private async uploadByteStream(
    byteStreamParamData: AbstractByteStreamParameterData,
    param: UploadParameter
  ): Promise<ProximaxDataModel> {
    const contentType = this.detectContentType(param, byteStreamParamData);
    const encryptedStream = this.encryptedStream(param, byteStreamParamData);
    const digest = await this.computeDigest(
      param.computeDigest,
      encryptedStream
    );

    return this.fileUploadService
      .uploadStream(encryptedStream)
      .pipe(
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
      )
      .toPromise();
  }

  private encryptedStream(
    param: UploadParameter,
    byteStreamParamData: AbstractByteStreamParameterData
  ) {
    return param.privacyStrategy.encrypt(byteStreamParamData.getByteStream());
  }

  private detectContentType(
    param: UploadParameter,
    paramData: AbstractByteStreamParameterData
  ): string {
    return (
      paramData.contentType ||
      (param.detectContentType && this.detectFileType(paramData))
    );
  }

  private detectFileType(paramData: AbstractByteStreamParameterData) {
    const fileType = require('file-type');
    const mimeType = fileType(paramData.getByteStream());
    return mimeType && mimeType.mime;
  }

  private async computeDigest(
    computeDigest: boolean,
    encryptedData: Stream
  ): Promise<string | undefined> {
    return computeDigest ? DigestUtils.computeDigest(encryptedData) : undefined;
  }
}
