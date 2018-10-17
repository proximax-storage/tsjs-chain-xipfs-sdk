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
  }

  /**
   * Get the byte stream
   * @return the byte stream
   */
  public abstract getByteStream(): Uint8Array;
}
