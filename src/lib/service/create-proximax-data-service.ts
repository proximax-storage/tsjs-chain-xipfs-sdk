import { map } from 'rxjs/operators';
import { ConnectionConfig } from '../connection/connection-config';
import { DigestUtils } from '../helper/digest-util';
import { ProximaxDataModel } from '../model/proximax/data-model';
import { AbstractByteStreamParameterData } from '../upload/abstract-byte-stream-parameter-data';
import { PathParameterData } from '../upload/path-parameter-data';
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
    } else if (param.data instanceof PathParameterData) {
      // TODO handle path upload
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
    const digest = await this.computeDigest(param, byteStreamParamData);

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
  ): string | undefined {
    return !paramData.contentType && param.detectContentType
      ? this.detectFileType()
      : paramData.contentType;
  }

  private detectFileType(): string | undefined {
    // TODO implement content type detection
    // file type does not accept stream
    // const fileType = require('file-type');
    // const mimeType = fileType(paramData.getByteStream());
    // return mimeType && mimeType.mime;
    return undefined;
  }

  private async computeDigest(
    param: UploadParameter,
    byteStreamParamData: AbstractByteStreamParameterData
  ): Promise<string | undefined> {
    return param.computeDigest
      ? DigestUtils.computeDigest(
          this.encryptedStream(param, byteStreamParamData)
        )
      : undefined;
  }
}
