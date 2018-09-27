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
 * Class represents download result data
 */
export class DownloadResultData {
  constructor(
    /**
     * The data hash
     */
    public dataHash: string,
    /**
     * The timestamp
     */
    public timestamp: number,
    /**
     * The actual data in bytes. This only available for PrivacyType.PLAIN
     */
    public bytes?: any,
    /**
     * The digest
     */
    public digest?: string,
    /**
     * The content description
     */
    public description?: string,
    /**
     * The content type
     */
    public contentType?: string,
    /**
     * The content name or file name
     */
    public name?: string,
    /**
     * The content metadata
     */
    public metadata?: Map<string, string>
  ) {}
}
