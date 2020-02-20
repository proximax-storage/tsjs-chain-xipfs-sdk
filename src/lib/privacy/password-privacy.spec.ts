import { expect } from 'chai';
import 'mocha';
import { StreamHelper } from '../helper/stream-helper';
import { PasswordPrivacyStrategy } from './password-privacy';

describe('PasswordPrivacy', () => {
  it('should encrypt and decrypt the message using password strategy', async () => {
    const password =
      'lkNzBmYmYyNTExZjZmNDYyZTdjYWJmNmY1MjJiYjFmZTk3Zjg2NDA5ZDlhOD';
    const plainText =
      'ProximaX is an advanced extension of the Blockchain';

    const stream = StreamHelper.string2Stream(plainText);

    const privacy = PasswordPrivacyStrategy.create(password);

    const encryptedStream = privacy.encrypt(stream);
    const encryptedBuffer = await StreamHelper.stream2Buffer(encryptedStream);
    const encryptedStreamFromBuffer = StreamHelper.buffer2Stream(
      encryptedBuffer
    );

    const decryptedStream = privacy.decrypt(encryptedStreamFromBuffer);
    const decryptedText = await StreamHelper.stream2String(decryptedStream);
   
    expect(decryptedText).to.be.equal(plainText);
  });
  
});
