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

import { NetworkType } from 'tsjs-xpx-chain-sdk';

/**
 * Enumerations blockchain network type
 */
export enum BlockchainNetworkType {
  MIJIN = NetworkType.MIJIN,
  MIJIN_TEST = NetworkType.MIJIN_TEST,
  MAIN_NET = NetworkType.MAIN_NET,
  TEST_NET = NetworkType.TEST_NET,
  PRIVATE = NetworkType.PRIVATE,
  PRIVATE_TEST = NetworkType.PRIVATE_TEST
}
