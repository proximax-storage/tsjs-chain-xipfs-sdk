import { FileStorageConnection } from '../connection/file-storage-connection';
import { ProximaxDataModel } from '../model/proximax/data-model';
import { AbstractByteStreamParameterData } from '../upload/abstract-byte-stream-parameter-data';
import { PathParameterData } from '../upload/path-parameter-data';
import { UploadParameter } from '../upload/upload-parameter';
import { FileRepositoryFactory } from './factory/file-repository-factory';
import { FileUploadService } from './file-upload-service';

/**
 * The service class responsible for creating the uploaded data object
 */
export class CreateProximaxDataService {
  private readonly fileUploadService: FileUploadService;

  /**
   * Construct this class
   *
   * @param fileStorageConnection the connection to file storage
   */
  constructor(public readonly fileStorageConnection: FileStorageConnection) {
    this.fileUploadService = new FileUploadService(
      FileRepositoryFactory.create(fileStorageConnection)
    );
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
      return new ProximaxDataModel('replaceme', 1);
    } else {
      throw new Error(`Uploading of type ${param.data.type} is not supported`);
    }
  }

  private async uploadByteStream(
    byteStreamParamData: AbstractByteStreamParameterData,
    param: UploadParameter
  ): Promise<ProximaxDataModel> {
    const contentType = this.detectContentType(param, byteStreamParamData);

    const fileUploadResponse = await this.fileUploadService.uploadStream(
      () => byteStreamParamData.getByteStream(),
      param.computeDigest,
      param.privacyStrategy
    );

    return new ProximaxDataModel(
      fileUploadResponse.hash,
      fileUploadResponse.timestamp,
      fileUploadResponse.digest,
      param.data.description,
      contentType,
      param.data.metadata,
      param.data.name
    );
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
}
