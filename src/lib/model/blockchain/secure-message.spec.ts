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

import { expect } from 'chai';
import 'mocha';
import { NetworkType, PublicAccount } from 'nem2-sdk';
import { RecipientAccount, SenderAccount } from '../../config/config.spec';
import { SecureMessage } from './secure-message';

describe('SecureMessage', () => {
  it('should create SecureMessage', () => {
    const message = 'Proximax P2P storage';
    const securedMessage = SecureMessage.encrypt(
      message,
      SenderAccount.privateKey,
      RecipientAccount.publicKey
    );
    // console.log(securedMessage.payload);
    expect(securedMessage.type).to.be.equal(2);
    expect(securedMessage.payload).to.be.not.equal(message);
  });

  it('should create SecureMessage and convert to Plain Message', () => {
    const message = 'Proximax P2P storage';
    const recipientPublicAccount = PublicAccount.createFromPublicKey(
      RecipientAccount.publicKey,
      NetworkType.MIJIN_TEST
    );

    const encryptedMessage = SecureMessage.encrypt(
      message,
      SenderAccount.privateKey,
      recipientPublicAccount.publicKey
    );
    // console.log(encryptedMessage);
    expect(encryptedMessage.type).to.be.equal(2);
    expect(encryptedMessage.payload).to.be.not.equal(message);

    const plainMessage = SecureMessage.decrypt(
      encryptedMessage.payload,
      RecipientAccount.privateKey,
      recipientPublicAccount.publicKey
    );
    expect(plainMessage.payload).to.be.equal(message);
    // console.log(plainMessage);
    // console.log(plainMessage.payload);
  });
});
