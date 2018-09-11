import { PrivacyType } from '../privacy/privacy-type';
import { UploadParameterData } from './upload-parameter-data';

export class UploadParameter {
  constructor(
    public readonly data: UploadParameterData,
    public readonly signerPrivateKey: string,
    public readonly recipientPublicKey: string,
    public readonly recipientAddress: string,
    // public readonly detectContentType?: boolean,
    public readonly transactionDeadline: number,
    public readonly useBlockhainSecureMessage: boolean,
    public readonly privacyStrategy: PrivacyType,
    public readonly version: string
  ) {}

  public validate(): void {
    if (this.data === null || this.data === undefined) {
      throw new Error('data is required');
    }

    if (this.data.byteStreams === null || this.data.byteStreams === undefined) {
      throw new Error('data input stream or bytes is required');
    }

    if (this.signerPrivateKey === null || this.signerPrivateKey === undefined) {
      throw new Error('singer privacy key is required');
    }
  }
}
