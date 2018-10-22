import * as fs from 'fs';
import { Stream } from 'stream';
import { AbstractByteStreamParameterData } from './abstract-byte-stream-parameter-data';

/**
 * This model class is one type of the upload parameter data that defines a file upload
 */
export class FileParameterData extends AbstractByteStreamParameterData {
  /**
   * Create instance
   * @param file the file to upload
   * @param description a searchable description attach on the upload
   * @param name a searchable name attach on the upload
   * @param contentType the content type attach on the upload
   * @param metadata a searchable key-pair metadata attach on the upload
   * @return the instance of this class
   */
  public static create(
    /**
     * The file to upload
     */
    file: string,
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
  ): FileParameterData {
    return new FileParameterData(
      file,
      name,
      description,
      contentType,
      metadata
    );
  }

  private constructor(
    public readonly file: string,
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
  public async getByteStream(): Promise<Stream> {
    return fs.createReadStream(this.file);
  }
}
