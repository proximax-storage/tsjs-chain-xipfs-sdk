import {AbstractByteStreamParameterData} from './abstract-byte-stream-parameter-data';
import {PassThrough, Stream} from "stream";

/**
 * This model class is one type of the upload parameter data that defines a string upload
 */
export class StringParameterData extends AbstractByteStreamParameterData {
  /**
   * Create instance by providing the string
   * @param text the string to upload
   * @param encoding the encoding of the string
   * @param description a searchable description attach on the upload
   * @param name a searchable name attach on the upload
   * @param contentType the content type attach on the upload
   * @param metadata a searchable key-pair metadata attach on the upload
   * @return the instance of this class
   */
  public static create(
    /**
     * The string
     */
    text: string,
    /**
     * The string encoding
     */
    encoding?: string,
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
  ): StringParameterData {
    return new StringParameterData(
      text,
      encoding,
      name,
      description,
      contentType,
      metadata
    );
  }

  private constructor(
    public readonly text: string,
    public readonly encoding?: string,
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
  public getByteStream(): Stream {
    const stream = new PassThrough();
    stream.write(Buffer.from(this.text, this.encoding && 'utf8'));
    stream.end();
    return stream;
  }
}
