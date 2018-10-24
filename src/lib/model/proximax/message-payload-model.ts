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

import { PrivacyType } from '../../privacy/privacy-type';
import { ProximaxDataModel } from './data-model';

/**
 * Class represents the Proximax message payload model
 */
export class ProximaxMessagePayloadModel {
  constructor(
    /**
     * The privacy type
     */
    public readonly privacyType: PrivacyType,
    /**
     * The proximax data model
     */
    public readonly data: ProximaxDataModel,
    /**
     * The message payload version
     */
    public readonly version: string
  ) {}
}
