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

import fs from 'fs';
import { Stream } from 'stream';
import { StreamHelper } from '../helper/stream-helper';

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
    public readonly streamFunction: () => Promise<Stream>,
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
    const stream = await this.streamFunction();
    return StreamHelper.stream2String(stream, encoding);
  }

  public async getContentAsBuffer(): Promise<Buffer> {
    const stream = await this.streamFunction();
    return StreamHelper.stream2Buffer(stream);
  }

  public async saveToFile(file: string): Promise<boolean> {
    const stream = await this.streamFunction();
    stream.pipe(fs.createWriteStream(file));
    return new Promise<boolean>((resolve, reject) => {
      stream.on('error', err => reject(err));
      stream.on('end', () => resolve(true));
    });
  }
}
