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

import { Mosaic } from 'tsjs-xpx-chain-sdk';
import {
  NemPrivacyStrategy,
  PasswordPrivacyStrategy,
  PlainPrivacyStrategy,
  PrivacyStrategy
} from '../..';
import { UploadParameter } from './upload-parameter';
import { UploadParameterData } from './upload-parameter-data';

export class UploadParameterBuilder {
  private recipientPublicKey?: string;
  private recipientAddress?: string;
  private privacyStrategy?: PrivacyStrategy;
  private transactionDeadline?: number;
  private transactionMosaics?: Mosaic[];
  private useBlockchainSecureMessage?: boolean;
  private detectContentType?: boolean;
  private computeDigest?: boolean;
  private generateHash:string;

  constructor(
    private data: UploadParameterData,
    private signerPrivateKey: string
  ) {
    if (!data) {
      throw new Error('data is required');
    }
    if (!signerPrivateKey) {
      throw new Error('signerPrivateKey is required');
    }
    // TODO private key validation
    // ParameterValidationUtils.checkParameter((PrivateKey.fromHexString(signerPrivateKey) != null,
    //   "signerPrivateKey should be a valid private key");
    this.data = data;
    this.signerPrivateKey = signerPrivateKey;
  }

  public withRecipientPublicKey(
    recipientPublicKey?: string
  ): UploadParameterBuilder {
    // TODO public key validation
    // checkParameter(() -> recipientPublicKey == null || PublicKey.fromHexString(recipientPublicKey) != null,
    // "recipientPublicKey should be a valid public key");

    this.recipientPublicKey = recipientPublicKey;
    return this;
  }

  public withRecipientAddress(
    recipientAddress?: string
  ): UploadParameterBuilder {
    // TODO address validation
    // checkParameter(() -> recipientAddress == null || Address.createFromRawAddress(recipientAddress) != null,
    // "recipientAddress should be a valid address");

    this.recipientAddress = recipientAddress;
    return this;
  }

  public withUseBlockchainSecureMessage(
    useBlockchainSecureMessage?: boolean
  ): UploadParameterBuilder {
    this.useBlockchainSecureMessage = useBlockchainSecureMessage;
    return this;
  }

  public withDetectContentType(
    detectContentType?: boolean
  ): UploadParameterBuilder {
    this.detectContentType = detectContentType;
    return this;
  }

  public withComputeDigest(computeDigest?: boolean): UploadParameterBuilder {
    this.computeDigest = computeDigest;
    return this;
  }

  public withTransactionDeadline(
    transactionDeadline?: number
  ): UploadParameterBuilder {
    if (
      transactionDeadline &&
      (transactionDeadline < 1 || transactionDeadline > 23)
    ) {
      throw new Error('transactionDeadline should be between 1 and 23');
    }

    this.transactionDeadline = transactionDeadline;
    return this;
  }

  public withTransactionMosaics(
    transactionMosaics?: Mosaic[]
  ): UploadParameterBuilder {
    this.transactionMosaics = transactionMosaics;
    return this;
  }

  public withPrivacyStrategy(
    privacyStrategy?: PrivacyStrategy
  ): UploadParameterBuilder {
    this.privacyStrategy = privacyStrategy;
    return this;
  }

  public withPlainPrivacy(): UploadParameterBuilder {
    this.privacyStrategy = PlainPrivacyStrategy.create();
    return this;
  }

  public withPasswordPrivacy(password: string): UploadParameterBuilder {
    this.privacyStrategy = PasswordPrivacyStrategy.create(password);
    return this;
  }

  public withNemKeysPrivacy(
    privateKey: string,
    publicKey: string
  ): UploadParameterBuilder {
    this.privacyStrategy = NemPrivacyStrategy.create(privateKey, publicKey);
    return this;
  }

  public build(): UploadParameter {
    return new UploadParameter(
      this.data,
      this.signerPrivateKey,
      this.privacyStrategy || PlainPrivacyStrategy.create(),
      this.transactionDeadline || 12,
      this.useBlockchainSecureMessage || false,
      this.generateHash,
      this.detectContentType || false,
      this.computeDigest || false,
      this.transactionMosaics,
      this.recipientPublicKey,
      this.recipientAddress
    );
  }
}
