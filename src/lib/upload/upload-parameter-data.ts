/**
 * This model class is one type of the upload parameter data that defines a byte stream upload
 */
export abstract class UploadParameterData {
  public static TYPE_BYTE_STREAM = 1;
  public static TYPE_PATH = 2;

  private static MAX_DESCRIPTION_LENGTH = 255;
  private static MAX_NAME_LENGTH = 100;
  private static MAX_CONTENT_TYPE_LENGTH = 127;
  // private static MAX_METADATA_JSON_LENGTH = 1000;

  constructor(
    /**
     * The type of parameter
     */
    public readonly type: number,
    /**
     * The content name
     */
    public readonly name?: string,
    /**
     * The content description
     */
    public readonly description?: string,
    /**
     * The content type
     */
    public readonly contentType?: string,
    /**
     * The content metadata
     */
    public readonly metadata?: Map<string, string>
  ) {
    if (this.name && this.name.length > UploadParameterData.MAX_NAME_LENGTH) {
      throw new Error(
        'name cannot be more than ' +
          UploadParameterData.MAX_NAME_LENGTH +
          ' characters'
      );
    }

    if (
      this.description &&
      this.description.length > UploadParameterData.MAX_DESCRIPTION_LENGTH
    ) {
      throw new Error(
        'description cannot be more than ' +
          UploadParameterData.MAX_DESCRIPTION_LENGTH +
          ' characters'
      );
    }

    if (
      this.contentType &&
      this.contentType.length > UploadParameterData.MAX_CONTENT_TYPE_LENGTH
    ) {
      throw new Error(
        'contentType cannot be more than ' +
          UploadParameterData.MAX_CONTENT_TYPE_LENGTH +
          ' characters'
      );
    }

    /*
    if (
      this.metadata &&
      JSON.stringify(this.metadata).length >
        UploadParameterData.MAX_METADATA_JSON_LENGTH
    ) {
      throw new Error(
        'metadata cannot be more than ' +
          UploadParameterData.MAX_METADATA_JSON_LENGTH +
          ' characters'
      );
    }*/
  }
}
