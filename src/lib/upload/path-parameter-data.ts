import { UploadParameterData } from './upload-parameter-data';

/**
 * This model class is one type of the upload parameter data that defines a path upload
 */
export class PathParameterData extends UploadParameterData {
  /**
   * Create instance
   * @param path the path to upload
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
    path: string,
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
  ): PathParameterData {
    return new PathParameterData(
      path,
      name,
      description,
      contentType,
      metadata
    );
  }

  private constructor(
    public readonly path: string,
    public readonly name?: string,
    public readonly description?: string,
    public readonly contentType?: string,
    public readonly metadata?: Map<string, string>
  ) {
    super(2, name, description, contentType, metadata);
  }
}
