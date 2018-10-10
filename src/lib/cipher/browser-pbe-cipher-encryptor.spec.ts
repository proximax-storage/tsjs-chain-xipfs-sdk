import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import 'mocha';
import { Converter } from '../helper/converter';
import { BrowserPBECipherEncryptor } from './browser-pbe-cipher-encryptor';

chai.use(chaiAsPromised);

describe('BrowserPBECipherEncryptor', () => {
  const password =
    'lkNzBmYmYyNTExZjZmNDYyZTdjYWJmNmY1MjJiYjFmZTk3Zjg2NDA5ZDlhOD';
  const plainText = 'The quick brown fox jumps over the lazy dog';
  const sampleSalt = new Uint8Array([
    72,
    189,
    200,
    136,
    241,
    77,
    17,
    160,
    186,
    15,
    90,
    205,
    122,
    154,
    149,
    83,
    54,
    183,
    210,
    173,
    248,
    200,
    175,
    23511,
    132,
    141,
    164,
    221,
    50,
    165,
    62
  ]);
  const sampleIv = new Uint8Array([
    217,
    238,
    111,
    44,
    208,
    173,
    214,
    137,
    233,
    83,
    203,
    59,
    27,
    55,
    165,
    189
  ]);
  const sampleCipherText: ArrayBuffer = new Uint8Array([0, 0, 0, 0, 0])
    .buffer as any;
  const sampleDecipherText: ArrayBuffer = new Uint8Array([1, 1, 1, 1, 1])
    .buffer as any;
  const sampleBaseCryptoKey = 'basecryptoKeyDummy';
  const sampleCryptoKey = 'cryptoKeyDummy';

  const crypto = {
    getRandomValues: (uint8Arr: Uint8Array) =>
      uint8Arr.length === 32 ? sampleSalt : sampleIv,
    subtle: {
      decrypt: () => Promise.resolve(sampleDecipherText),
      deriveKey: () => Promise.resolve(sampleCryptoKey),
      encrypt: () => Promise.resolve(sampleCipherText),
      importKey: () => Promise.resolve(sampleBaseCryptoKey)
    }
  };

  it('should encrypt with password', async () => {
    const expected = new Uint8Array(
      sampleSalt.length + sampleIv.length + sampleCipherText.byteLength
    );
    expected.set(sampleSalt);
    expected.set(sampleIv, sampleSalt.length);
    expected.set(
      new Uint8Array(sampleCipherText),
      sampleSalt.length + sampleIv.length
    );

    const encryptor = new BrowserPBECipherEncryptor(password, crypto);
    const cipherText = await encryptor.encrypt(Converter.str2ab(plainText));

    console.log(new Uint8Array(cipherText));
    console.log(expected);
    expect(new Uint8Array(cipherText)).to.be.eql(expected);
  });

  it('should decrypt with password', async () => {
    const encryptor = new BrowserPBECipherEncryptor(password, crypto);
    const cipherText = await encryptor.encrypt(Converter.str2ab(plainText));
    const decipherText = await encryptor.decrypt(cipherText);
    expect(decipherText).to.be.equal(sampleDecipherText);
  });
});
