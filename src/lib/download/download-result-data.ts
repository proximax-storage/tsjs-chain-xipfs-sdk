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


import {Stream} from "stream";

/**
 * Class represents download result data
 */
export class DownloadResultData {
  constructor(
    /**
     * The data hash
     */
    public readonly dataHash: string,
    /**
     * The timestamp
     */
    public readonly timestamp: number,
    /**
     * The actual data in bytes. This only available for PrivacyType.PLAIN
     */
    public readonly getStreamFunction: () => Promise<Stream>,
    /**
     * The digest
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
     * The content name or file name
     */
    public readonly name?: string,
    /**
     * The content metadata
     */
    public readonly metadata?: Map<string, string>
  ) {}

  public async getContentsAsString(encoding?: string): Promise<string> {
    const stream = await this.getStreamFunction();
    stream.setEncoding('utf8');
    stream.on('data', function(chunk) {
      assert.equal(typeof chunk, 'string');
      console.log('got %d characters of string data', chunk.length);
    })
  }
}
