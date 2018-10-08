import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import 'mocha';
import { Converter } from '../helper/converter';
import { NodeJsPBECipherEncryptor } from './nodejs-pbe-cipher-encryptor';

chai.use(chaiAsPromised);

describe('NodeJsPBECipherEncryptor', () => {
  const password =
    'lkNzBmYmYyNTExZjZmNDYyZTdjYWJmNmY1MjJiYjFmZTk3Zjg2NDA5ZDlhOD';
  const plainText = 'The quick brown fox jumps over the lazy dog';

  it('should encrypt with password', async () => {
    const encryptor = new NodeJsPBECipherEncryptor(password);
    const cipherText = await encryptor.encrypt(Converter.str2ab(plainText));
    expect(Converter.ab2str(cipherText)).to.be.not.equal(plainText);
  });

  it('should decrypt with password', async () => {
    const encryptor = new NodeJsPBECipherEncryptor(password);
    const cipherText = await encryptor.encrypt(Converter.str2ab(plainText));
    const decipherText = await encryptor.decrypt(cipherText);
    expect(Converter.ab2str(decipherText)).to.be.equal(plainText);
  });

  it('should fail with wrong password', async () => {
    const encryptor = new NodeJsPBECipherEncryptor(password);
    const anotherEncryptor = new NodeJsPBECipherEncryptor(
      'tryandtryuntilyousucceed'
    );
    const cipherText = await encryptor.encrypt(Converter.str2ab(plainText));
    expect(anotherEncryptor.decrypt(cipherText)).to.be.rejectedWith(Error);
  });
});
