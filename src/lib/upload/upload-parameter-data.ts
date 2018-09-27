/*
 * Copyright 2018 ProximaX Limited
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Class represents the upload parameter data
 */
export class UploadParameterData {
  private MAX_DESCRIPTION_LENGTH = 100;
  private MAX_NAME_LENGTH = 100;
  private MAX_CONTENT_TYPE_LENGTH = 30;
  private MAX_METADATA_JSON_LENGTH = 400;

  constructor(
    /**
     * The content name
     */
    public name: string,
    /**
     * The content description
     */
    public description: string,
    /**
     * The content type
     */
    public contentType: string,
    /**
     * The content metadata
     */
    public metadata: Map<string, string>,
    /**
     * The content in stream
     */
    public byteStreams?: any,
    /**
     * The data path
     */
    public path?: string,
    /**
     * The ipfs callback options e.g { progress: handle}
     */
    public options?: object
  ) {
    if (this.description.length > this.MAX_DESCRIPTION_LENGTH) {
      throw new Error(
        'description cannot be more than ' +
          this.MAX_DESCRIPTION_LENGTH +
          ' characters'
      );
    }

    if (this.name.length > this.MAX_NAME_LENGTH) {
      throw new Error(
        'name cannot be more than ' + this.MAX_NAME_LENGTH + ' characters'
      );
    }

    if (this.contentType.length > this.MAX_CONTENT_TYPE_LENGTH) {
      throw new Error(
        'contentType cannot be more than ' +
          this.MAX_CONTENT_TYPE_LENGTH +
          ' characters'
      );
    }

    if (JSON.stringify(this.metadata).length > this.MAX_METADATA_JSON_LENGTH) {
      throw new Error(
        'metadata cannot be more than ' +
          this.MAX_METADATA_JSON_LENGTH +
          ' characters'
      );
    }
  }

  /**
   * Validates the upload parameter data
   */
  public validate(): void {
    if (!this.byteStreams) {
      throw new Error('The content stream is required');
    }
  }
}
