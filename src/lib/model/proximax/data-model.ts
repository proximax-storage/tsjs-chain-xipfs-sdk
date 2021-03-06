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
 * Class represents the Proximax data model
 */
export class ProximaxDataModel {
  constructor(
    /**
     * The datahash
     */
    public readonly dataHash: string,
    /**
     * The timestamp
     */
    public readonly timestamp: number,
    /**
     * The data digest
     */
    public readonly digest?: string,
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
    public readonly metadata?: Map<string, string>,
    /**
     * The content name
     */
    public readonly name?: string
  ) {
    if (!this.dataHash || this.dataHash.length <= 0) {
      throw new Error('Data hash is required');
    }
  }

  public toJSON(): object {
    let metadataJson;
    if (this.metadata) {
      metadataJson = {};
      this.metadata.forEach((value, key) => (metadataJson![key] = value));
    }

    return {
      contentType: this.contentType,
      dataHash: this.dataHash,
      description: this.description,
      digest: this.digest,
      metadata: metadataJson,
      name: this.name,
      timestamp: this.timestamp
    };
  }
}
