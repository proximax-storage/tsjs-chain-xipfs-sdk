
import { NemPrivacyStrategy } from '../privacy/nem-privacy';
import { PasswordPrivacyStrategy } from '../privacy/password-privacy';
import { PlainPrivacyStrategy } from '../privacy/plain-privacy';
import { PrivacyStrategy } from '../privacy/privacy';
import { DirectDownloadParameter } from './direct-download-parameter';

export class DirectDownloadParameterBuilder {
  public static createFromTransactionHash(
    transactionHash: string,
    accountPrivateKey?: string,
    validateDigest?: boolean
  ): DirectDownloadParameterBuilder {
    if (!transactionHash) {
      throw new Error('transactionHash is required');
    }

    const builder = new DirectDownloadParameterBuilder();
    builder.transactionHash = transactionHash;
    builder.accountPrivateKey = accountPrivateKey;
    builder.validateDigest = validateDigest || false;
    return builder;
  }

  public static createFromDataHash(
    dataHash: string,
    digest?: string
  ): DirectDownloadParameterBuilder {
    if (!dataHash) {
      throw new Error('dataHash is required');
    }

    const builder = new DirectDownloadParameterBuilder();
    builder.dataHash = dataHash;
    builder.digest = digest;
    builder.validateDigest = true;
    return builder;
  }

  private validateDigest: boolean;
  private transactionHash?: string;
  private accountPrivateKey?: string;
  private dataHash?: string;
  private privacyStrategy?: PrivacyStrategy;
  private digest?: string;

  private constructor() {}

  /**
   * Set the privacy strategy to decrypt the data
   * <br>
   * <br>
   * Privacy strategy defines how the data will be decrypted
   * @param privacyStrategy the privacy strategy
   * @return the same instance of this builder
   */
  public withPrivacyStrategy(
    privacyStrategy: PrivacyStrategy
  ): DirectDownloadParameterBuilder {
    this.privacyStrategy = privacyStrategy;
    return this;
  }

  /**
   * Set the privacy strategy as plain
   * <br>
   * <br>
   * Privacy strategy defines how the data will be decrypted
   * @return the same instance of this builder
   */
  public withPlainPrivacy(): DirectDownloadParameterBuilder {
    this.privacyStrategy = PlainPrivacyStrategy.create();
    return this;
  }

  /**
   * Set the privacy strategy as secured with password
   * <br>
   * <br>
   * Privacy strategy defines how the data will be decrypted
   * @param password a 50-character minimum password
   * @return the same instance of this builder
   */
  public withPasswordPrivacy(password: string): DirectDownloadParameterBuilder {
    this.privacyStrategy = PasswordPrivacyStrategy.create(password);
    return this;
  }

  /**
   * Set the privacy strategy as secured with nem keys
   * <br>
   * <br>
   * Privacy strategy defines how the data will be decrypted
   * @param privateKey the private key of one blockchain account that encrypted the data
   * @param publicKey the public key of the other blockchain account that encrypted the data
   * @return the same instance of this builder
   */
  public withNemKeysPrivacy(
    privateKey: string,
    publicKey: string
  ): DirectDownloadParameterBuilder {
    this.privacyStrategy = NemPrivacyStrategy.create(privateKey, publicKey);
    return this;
  }

  public build(): DirectDownloadParameter {
    return new DirectDownloadParameter(
      this.privacyStrategy || PlainPrivacyStrategy.create(),
      this.validateDigest,
      this.transactionHash,
      this.accountPrivateKey,
      this.dataHash,
      this.digest
    );
  }
}
