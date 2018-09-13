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
  constructor(
    /**
     * The content in stream
     */
    public byteStreams: any,
    /**
     * The data path
     */
    public path?: string,
    /**
     * The ipfs callback options e.g { progress: handle}
     */
    public options?: object,
    /**
     * The content description
     */
    public description?: string,
    /**
     * The content type
     */
    public contentType?: string,
    /**
     * The content metadata
     */
    public metadata?: Map<string, object>,
    /**
     * The content name
     */
    public name?: string
  ) {}

  /**
   * Validates the upload parameter data
   */
  public validate(): void {
    if (!this.byteStreams) {
      throw new Error('The content stream is required');
    }
  }
}
