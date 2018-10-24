import 'mocha';
import { RecipientAccount, SenderAccount } from '../config/testconfig';
import { NemPrivacyStrategy } from './nem-privacy';

import { expect } from 'chai';
import { StreamHelper } from '../helper/stream-helper';

describe('NemPrivacy', () => {
  it('should encrypt and decrypt data with sender private key', async () => {
    const plainText =
      'ProximaX is an advanced extension of the Blockchain and Distributed Ledger Technology (DLT) with utility-rich services and protocols';
    const stream = StreamHelper.string2Stream(plainText);

    const privacy = NemPrivacyStrategy.create(
      SenderAccount.privateKey,
      RecipientAccount.publicKey
    );

    const encryptedStream = privacy.encrypt(stream);
    const encryptedBuffer = await StreamHelper.stream2Buffer(encryptedStream);
    const encryptedStreamFromBuffer = StreamHelper.buffer2Stream(
      encryptedBuffer
    );

    const decryptedStream = privacy.decrypt(encryptedStreamFromBuffer);

    const decryptedText = await StreamHelper.stream2String(decryptedStream);
    expect(decryptedText).to.be.equal(plainText);
  });

  it('should decrypt data with receiver private key', async () => {
    const plainText =
      'ProximaX is an advanced extension of the Blockchain and Distributed Ledger Technology (DLT) with utility-rich services and protocols';

    const stream = StreamHelper.string2Stream(plainText);

    const privacy = NemPrivacyStrategy.create(
      SenderAccount.privateKey,
      RecipientAccount.publicKey
    );

    const encryptedStream = privacy.encrypt(stream);
    const encryptedBuffer = await StreamHelper.stream2Buffer(encryptedStream);
    const encryptedStreamFromBuffer = StreamHelper.buffer2Stream(
      encryptedBuffer
    );

    const receiverPrivacy = NemPrivacyStrategy.create(
      RecipientAccount.privateKey,
      SenderAccount.publicKey
    );
    const decryptedStream = receiverPrivacy.decrypt(encryptedStreamFromBuffer);

    const decryptedText = await StreamHelper.stream2String(decryptedStream);
    expect(decryptedText).to.be.equal(plainText);
  });
});
