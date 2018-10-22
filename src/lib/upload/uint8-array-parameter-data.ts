import { PassThrough, Readable } from 'stream';
import { AbstractByteStreamParameterData } from './abstract-byte-stream-parameter-data';

/**
 * This model class is one type of the upload parameter data that defines a Uint8Array upload
 */
export class Uint8ArrayParameterData extends AbstractByteStreamParameterData {
  /**
   * Create instance
   * @param data the array to upload
   * @param description a searchable description attach on the upload
   * @param name a searchable name attach on the upload
   * @param contentType the content type attach on the upload
   * @param metadata a searchable key-pair metadata attach on the upload
   * @return the instance of this class
   */
  public static create(
    /**
     * The data
     */
    data: Uint8Array,
    /**
     * The content name
     */
    name?: string,
    /**
     * The content description
     */
    description?: string,
    /**
     * The content type
     */
    contentType?: string,
    /**
     * The content metadata
     */
    metadata?: Map<string, string>
  ): Uint8ArrayParameterData {
    return new Uint8ArrayParameterData(
      data,
      name,
      description,
      contentType,
      metadata
    );
  }

  private constructor(
    public readonly data: Uint8Array,
    public readonly name?: string,
    public readonly description?: string,
    public readonly contentType?: string,
    public readonly metadata?: Map<string, string>
  ) {
    super(name, description, contentType, metadata);
  }

  /**
   * Get the byte stream
   * @return the byte stream
   */
  public async getByteStream(): Promise<Readable> {
    const stream = new PassThrough();
    stream.write(Buffer.from(this.data));
    stream.end();
    return stream;
  }
}
