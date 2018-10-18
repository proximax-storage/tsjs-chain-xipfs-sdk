import 'mocha';
import { RecipientAccount, SenderAccount } from '../config/testconfig';
import { NemPrivacyStrategy } from './nem-privacy';

import { expect } from 'chai';
import { TextDecoder, TextEncoder } from 'text-encoding-utf-8';

describe('NemPrivacy', () => {
  it('should encrypt and decrypt data using NemPrivacy', () => {
    const plainText =
      'ProximaX is an advanced extension of the Blockchain and Distributed Ledger Technology (DLT) with utility-rich services and protocols';

    const data = new TextEncoder().encode(plainText);

    const privacy = NemPrivacyStrategy.create(
      SenderAccount.privateKey,
      RecipientAccount.publicKey
    );

    const encryptedData: Uint8Array = privacy.encrypt(data);

    const decryptedData = privacy.decrypt(encryptedData);

    const decryptedText = new TextDecoder().decode(decryptedData);

    console.log(decryptedText);
    expect(decryptedText).to.be.equal(plainText);
  });

  it('should decrypt data with receiver private key', () => {
    const plainText =
      'ProximaX is an advanced extension of the Blockchain and Distributed Ledger Technology (DLT) with utility-rich services and protocols';

    const data = new TextEncoder().encode(plainText);

    const privacy = NemPrivacyStrategy.create(
      SenderAccount.privateKey,
      RecipientAccount.publicKey
    );

    const encryptedData: Uint8Array = privacy.encrypt(data);

    const receiverPrivacy = NemPrivacyStrategy.create(
      RecipientAccount.privateKey,
      SenderAccount.publicKey
    );

    const decryptedData = receiverPrivacy.decrypt(encryptedData);

    const decryptedText = new TextDecoder().decode(decryptedData);

    console.log(decryptedText);
    expect(decryptedText).to.be.equal(plainText);
  });
});
