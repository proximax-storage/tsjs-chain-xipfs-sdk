import { convert, KeyPair } from 'proximax-nem2-library';
import { NemPrivacyStrategy } from '../..';
import { Converter } from '../helper/converter';
import { PKeyPair } from '../model/blockchain/keypair';
import { PasswordPrivacyStrategy } from '../privacy/password-privacy';
import { PlainPrivacyStrategy } from '../privacy/plain-privacy';
import { PrivacyStrategy } from '../privacy/privacy';
import { DownloadParameter } from './download-parameter';

export class DownloadParameterBuilder {
  private transactionHash;
  private accountPrivateKey;
  private accountPublicKey;
  private privacyStrategy;
  private validateDigest;

  constructor(transactionHash: string) {
    if (transactionHash === null || transactionHash.length <= 0) {
      throw new Error('transactionHash is required');
    }

    this.transactionHash = transactionHash;
  }

  public withAccountPrivateKey(
    accountPrivateKey: string
  ): DownloadParameterBuilder {
    if (
      accountPrivateKey === null ||
      accountPrivateKey.length <= 0 ||
      Converter.isHex(accountPrivateKey)
    ) {
      throw new Error('accountPrivateKey should be a valid private key');
    }

    this.accountPrivateKey = accountPrivateKey;

    // create account public key
    const accountKeyPair: PKeyPair = KeyPair.createKeyPairFromPrivateKeyString(
      accountPrivateKey
    );
    this.accountPublicKey = convert.uint8ToHex(accountKeyPair.publicKey);

    return this;
  }

  public withPrivacyStrategy(
    privacyStrategy: PrivacyStrategy
  ): DownloadParameterBuilder {
    this.privacyStrategy = privacyStrategy;
    return this;
  }

  public withPlainPrivacy(): DownloadParameterBuilder {
    this.privacyStrategy = PlainPrivacyStrategy.create();
    return this;
  }

  public withPasswordPrivacy(password: string): DownloadParameterBuilder {
    this.privacyStrategy = PasswordPrivacyStrategy.create(password);
    return this;
  }

  public withNemKeysPrivacy(
    privateKey: string,
    publicKey: string
  ): DownloadParameterBuilder {
    this.privacyStrategy = NemPrivacyStrategy.create(privateKey, publicKey);
    return this;
  }
  public withValidateDigest(validateDigest: boolean): DownloadParameterBuilder {
    this.validateDigest = validateDigest;
    return this;
  }

  public build(): DownloadParameter {
    if (this.privacyStrategy === null) {
      this.privacyStrategy = PlainPrivacyStrategy.create();
    }

    if (this.validateDigest == null) {
      this.validateDigest = false;
    }

    return new DownloadParameter(
      this.transactionHash,
      this.accountPrivateKey,
      this.accountPublicKey,
      this.privacyStrategy,
      this.validateDigest
    );
  }
}
