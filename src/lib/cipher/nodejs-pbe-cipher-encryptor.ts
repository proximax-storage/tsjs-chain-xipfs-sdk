import crypto, { CipherGCM, DecipherGCM } from 'crypto';
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

export class NodeJsPBECipherEncryptor {
  private readonly algorithm = 'aes-128-gcm';

  // random salt
  private readonly saltLength = 32;

  // initialise vector
  private readonly ivLength = 16;

  // auth tag
  private readonly tagLength = 128 / 8;

  // The secret hash
  private readonly password: Buffer;

  /**
   * SecuredCipher constructor
   * @param password the password
   */
  constructor(password: string) {
    this.password = Buffer.from(password, 'utf8');
  }

  /**
   * Encrypts data
   * @param data the data to be encrypted
   */
  public async encrypt(data: ArrayBuffer): Promise<ArrayBuffer> {
    const salt = crypto.randomBytes(this.saltLength);
    const iv = crypto.randomBytes(this.ivLength);
    const dataBuffer = Buffer.from(data);

    const key = this.getSecret(salt);
    // @ts-ignore
    const cipher: CipherGCM = crypto.createCipheriv(this.algorithm, key, iv);

    const encrypted = Buffer.concat([
      cipher.update(dataBuffer),
      cipher.final()
    ]);
    const tag = cipher.getAuthTag();

    // @ts-ignore
    return Converter.b2ab(Buffer.concat([salt, iv, encrypted, tag]));
  }

  /**
   * Decrypts data
   * @param data the encrypted data
   * @returns Promise<string>
   */
  public async decrypt(data: ArrayBuffer): Promise<ArrayBuffer> {
    const dataBuffer = Buffer.from(data);
    const { salt, iv, cipherText, tag } = this.extractParts(dataBuffer);

    const key = this.getSecret(salt);
    // @ts-ignore
    const decipher: DecipherGCM = crypto.createDecipheriv(
      this.algorithm,
      key,
      iv
    );
    decipher.setAuthTag(tag);

    // @ts-ignore
    return Converter.b2ab(
      Buffer.concat([decipher.update(cipherText), decipher.final()])
    );
  }

  private getSecret(salt: Buffer): Buffer {
    return crypto.pbkdf2Sync(this.password, salt, 65536, 128 / 8, 'sha256');
  }

  private extractParts(dataBuffer: Buffer) {
    const salt = Buffer.from(dataBuffer.slice(0, this.saltLength));
    const iv = Buffer.from(
      dataBuffer.slice(this.saltLength, this.saltLength + this.ivLength)
    );
    const cipherText = Buffer.from(
      dataBuffer.slice(
        this.saltLength + this.ivLength,
        dataBuffer.byteLength - this.tagLength
      )
    );
    const tag = Buffer.from(
      dataBuffer.slice(
        dataBuffer.byteLength - this.tagLength,
        dataBuffer.byteLength
      )
    );
    return { salt, iv, cipherText, tag };
  }
}
