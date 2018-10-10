import { Converter } from '../helper/converter';
/**
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

export class BrowserPBECipherEncryptor {
  // random salt
  private readonly saltLength = 32;

  // initialise vector
  private readonly ivLength = 16;

  // The secret hash
  private readonly password: ArrayBuffer;

  // The window crypto module
  private readonly crypto: Crypto;

  /**
   * SecuredCipher constructor
   * @param password the password
   */
  constructor(password: string, crypto?: any) {
    this.password = Converter.str2ab(password);
    this.crypto = crypto || window.crypto;
  }

  /**
   * Encrypts data
   * @param data the data to be encrypted
   */
  public async encrypt(data: ArrayBuffer): Promise<ArrayBuffer> {
    const salt = this.crypto.getRandomValues(new Uint8Array(this.saltLength));
    const iv = this.crypto.getRandomValues(new Uint8Array(this.ivLength));

    const key = await this.getSecretKey(salt);
    const cipherBuffer = await this.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      data
    );

    const finalCipher = Converter.concatenate(
      Uint8Array,
      salt,
      iv,
      new Uint8Array(cipherBuffer)
    );

    return finalCipher.buffer;
  }

  /**
   * Decrypts data
   * @param data the encrypted data
   * @returns Promise<string>
   */
  public async decrypt(data: ArrayBuffer): Promise<ArrayBuffer> {
    const dataArray = new Uint8Array(data);
    const salt = dataArray.slice(0, this.saltLength);
    const iv = dataArray.slice(
      this.saltLength,
      this.saltLength + this.ivLength
    );
    const encryptedCipher = dataArray.slice(
      this.saltLength + this.ivLength,
      data.byteLength
    );
    const key = await this.getSecretKey(salt);

    const decryptedCipher = await this.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      encryptedCipher
    );

    return decryptedCipher;
  }

  private async getSecretKey(salt) {
    const baseKey = await this.crypto.subtle.importKey(
      'raw',
      this.password,
      'PBKDF2',
      false,
      ['deriveKey']
    );

    const params = {
      hash: 'SHA-256',
      iterations: 65536,
      name: 'PBKDF2',
      salt
    };

    const key = await this.crypto.subtle.deriveKey(
      params,
      baseKey,
      { name: 'AES-GCM', length: 128 },
      false,
      ['encrypt', 'decrypt']
    );
    return key;
  }
}
