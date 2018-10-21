import * as fs from 'fs';
import { Stream } from 'stream';
import { AbstractByteStreamParameterData } from './abstract-byte-stream-parameter-data';

/**
 * This model class is one type of the upload parameter data that defines a URL resource upload
 */
export class UrlResourceParameterData extends AbstractByteStreamParameterData {
  /**
   * Create instance
   * @param url the url resource to upload
   * @param description a searchable description attach on the upload
   * @param name a searchable name attach on the upload
   * @param contentType the content type attach on the upload
   * @param metadata a searchable key-pair metadata attach on the upload
   * @return the instance of this class
   */
  public static create(
    /**
     * The url resource
     */
    url: string,
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
  ): UrlResourceParameterData {
    return new UrlResourceParameterData(
      url,
      name,
      description,
      contentType,
      metadata
    );
  }

  private constructor(
    public url: string,
    public name?: string,
    public description?: string,
    public contentType?: string,
    public metadata?: Map<string, string>
  ) {
    super(name, description, contentType, metadata);
  }

  /**
   * Get the byte stream
   * @return the byte stream
   */
  public getByteStream(): Stream {
    return fs.createReadStream(this.url);
  }
}
