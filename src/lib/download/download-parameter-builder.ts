import { NemPrivacyStrategy } from '../..';
import { PasswordPrivacyStrategy } from '../privacy/password-privacy';
import { PlainPrivacyStrategy } from '../privacy/plain-privacy';
import { PrivacyStrategy } from '../privacy/privacy';
import { DownloadParameter } from './download-parameter';

/**
 * This builder class creates the DownloadParameter
 */
export class DownloadParameterBuilder {
  private accountPrivateKey?: string;
  private privacyStrategy?: PrivacyStrategy;
  private validateDigest?: boolean;

  /**
   * Construct the builder class with transaction hash
   * @param transactionHash the blockchain transaction hash to download
   */
  constructor(private readonly transactionHash: string) {
    if (!transactionHash) {
      throw new Error('transactionHash is required');
    }

    this.transactionHash = transactionHash;
  }

  /**
   * Set the account private key of either sender or recipient of the transaction (required for secure messages)
   * @param accountPrivateKey the account private key
   * @return the same instance of this builder
   */
  public withAccountPrivateKey(
    accountPrivateKey: string
  ): DownloadParameterBuilder {
    this.accountPrivateKey = accountPrivateKey;
    return this;
  }

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
  ): DownloadParameterBuilder {
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
  public withPlainPrivacy(): DownloadParameterBuilder {
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
  public withPasswordPrivacy(password: string): DownloadParameterBuilder {
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
  ): DownloadParameterBuilder {
    this.privacyStrategy = NemPrivacyStrategy.create(privateKey, publicKey);
    return this;
  }

  /**
   * Set the flag that indicates if need to verify digest
   * @param validateDigest the validate digest flag
   * @return the validate digest flag
   */
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
