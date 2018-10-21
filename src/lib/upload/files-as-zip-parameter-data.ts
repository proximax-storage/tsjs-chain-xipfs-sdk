import { AbstractByteStreamParameterData } from './abstract-byte-stream-parameter-data';
import {Stream} from "stream";

/**
 * This model class is one type of the upload parameter data that defines a zip upload
 */
export class FilesAsZipParameterData extends AbstractByteStreamParameterData {
  /**
   * Create instance
   * @param files the files to zip and upload
   * @param description a searchable description attach on the upload
   * @param name a searchable name attach on the upload
   * @param contentType the content type attach on the upload
   * @param metadata a searchable key-pair metadata attach on the upload
   * @return the instance of this class
   */
  public static create(
    /**
     * The files to zip and upload
     */
    files: string[],
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
  ): FilesAsZipParameterData {
    return new FilesAsZipParameterData(
      files,
      name,
      description,
      contentType,
      metadata
    );
  }

  private constructor(
    public readonly files: string[],
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
    // TODO
    throw new Error('Not yet implemented');
  }
}
