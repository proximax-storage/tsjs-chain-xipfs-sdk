import { TextDecoder, TextEncoder } from 'text-encoding-utf-8';
import { decode, encode } from 'typescript-base64-arraybuffer';
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

export class PBECipherEncryptor {
  // random salt
  private salt = new Uint8Array(32);

  // initialise vector
  private iv = new Uint8Array(16);

  // The algorithm used to generate the key
  private alg = 'AES-GCM';

  // The key usage for encrypt and decrypt
  private keyUsage: string[] = ['encrypt', 'decrypt'];

  // The secret hash
  private secret: Uint8Array;

  // The crypto provider
  private cryptoJS;

  /**
   * SecuredCipher constructor
   * @param secret the secret
   */
  constructor(secret: Uint8Array) {
    this.salt = crypto.getRandomValues(new Uint8Array(32));
    this.iv = crypto.getRandomValues(new Uint8Array(16));
    this.secret = secret;
    this.cryptoJS = crypto.subtle;
  }

  /**
   * Encrypts data
   * @param data the data to be encrypted
   * @returns Promise<string>
   */
  public encrypt(data: any): Promise<string> {
    try {
      // use algorithm
      const alg = { name: 'PBKDF2' };

      return this.cryptoJS
        .importKey('raw', this.secret, alg, false, ['deriveKey'])
        .then(baseKey => {
          const params = {
            hash: 'SHA-256',
            iterations: 65536,
            name: 'PBKDF2',
            salt: this.salt
          };
          return this.cryptoJS.deriveKey(
            params,
            baseKey,
            { name: this.alg, length: 128 },
            false,
            this.keyUsage
          );
        })
        .then(key => {
          return this.cryptoJS
            .encrypt(
              { name: 'AES-GCM', iv: this.iv },
              key,
              data
             // new TextEncoder().encode(data)
            )
            .then(cipherBuffer => {
              return encode(cipherBuffer);
            }) as Promise<string>;
        });
    } catch (e) {
      return Promise.reject(e);
    }
  }

  /**
   * Decrypts data
   * @param data the encrypted data
   * @returns Promise<string>
   */
  public decrypt(data: any): Promise<string> {
    try {
      const buffer = decode(data);

      // use algorithm
      const alg = { name: 'PBKDF2' };
      return this.cryptoJS
        .importKey('raw', this.secret, alg, false, ['deriveKey'])
        .then(baseKey => {
          const params = {
            hash: 'SHA-256',
            // too big for low powered device, however,
            // this need to match the java sdk
            iterations: 65536,
            name: 'PBKDF2',
            salt: this.salt
          };
          return this.cryptoJS.deriveKey(
            params,
            baseKey,
            { name: this.alg, length: 128 },
            false,
            this.keyUsage
          );
        })
        .then(key => {
          return this.cryptoJS
            .decrypt({ name: 'AES-GCM', iv: this.iv }, key, buffer)
            .then(decryptedBuffer => {
              // console.log(decryptedBuffer);
              return new TextDecoder().decode(new Uint8Array(decryptedBuffer));
            }) as Promise<string>;
        });
    } catch (e) {
      return Promise.reject(e);
    }
  }
}
