import { NemPrivacyStrategy } from '../..';
import { PasswordPrivacyStrategy } from '../privacy/password-privacy';
import { PlainPrivacyStrategy } from '../privacy/plain-privacy';
import { PrivacyStrategy } from '../privacy/privacy';
import { DownloadParameter } from './download-parameter';

export class DownloadParameterBuilder {
  private accountPrivateKey?: string;
  private privacyStrategy?: PrivacyStrategy;
  private validateDigest?: boolean;

  constructor(private readonly transactionHash: string) {
    if (!transactionHash) {
      throw new Error('transactionHash is required');
    }

    this.transactionHash = transactionHash;
  }

  public withAccountPrivateKey(
    accountPrivateKey: string
  ): DownloadParameterBuilder {
    this.accountPrivateKey = accountPrivateKey;
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
    return new DownloadParameter(
      this.transactionHash,
      this.privacyStrategy || PlainPrivacyStrategy.create(),
      this.validateDigest || false,
      this.accountPrivateKey
    );
  }
}
