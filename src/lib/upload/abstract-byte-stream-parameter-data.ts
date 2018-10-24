import { Readable } from 'stream';
import { ReservedContentTypes } from '../config/constants';
import { UploadParameterData } from './upload-parameter-data';

/**
 * This model class is one type of the upload parameter data that defines a byte stream upload
 */
export abstract class AbstractByteStreamParameterData extends UploadParameterData {
  protected constructor(
    public readonly name?: string,
    public readonly description?: string,
    public readonly contentType?: string,
    public readonly metadata?: Map<string, string>
  ) {
    super(1, name, description, contentType, metadata);

    if (contentType && ReservedContentTypes.indexOf(contentType) >= 0) {
      throw new Error(
        `content type ${contentType} cannot be used as it is reserved`
      );
    }
  }

  /**
   * Get the byte stream
   * @return the byte stream
   */
  public abstract async getByteStream(): Promise<Readable>;
}
