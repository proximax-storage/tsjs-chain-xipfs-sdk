import { PlainMessage } from 'nem2-sdk';
import { CryptoHelper } from '../../helper/crypto-helper';

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
 * Class represents secure message
 */
export class SecureMessage {
  /**
   * Encrypts the message
   * @param message the message to be secured
   * @param privateKey the private key
   * @param publicKey the public key
   */
  public static encrypt(
    message: string,
    privateKey: string,
    publicKey: string
  ): SecureMessage {
    const encryptedMessage = CryptoHelper.encode(
      message,
      privateKey,
      publicKey
    );
    return new SecureMessage(2, encryptedMessage);
  }

  /**
   * Decrypts the message
   * @param message the secured mesage
   * @param key the key to decrypt message
   */
  public static decrypt(message: string, key: string): PlainMessage {
    const decryptedMessage = CryptoHelper.decode(message, key);
    return PlainMessage.create(decryptedMessage);
  }

  /**
   * @param type the secure message type
   * @param payload the message payload
   */
  private constructor(
    public readonly type: number,
    public readonly payload: string
  ) {}
}
