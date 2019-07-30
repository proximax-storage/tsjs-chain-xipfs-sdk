import { ProximaxDataModel } from '../model/proximax/data-model';
import { ProximaxMessagePayloadModel } from '../model/proximax/message-payload-model';
import { UploadParameter } from '../upload/upload-parameter';

/**
 * The service class responsible for retrieving message payload from transaction
 */
export class CreateProximaxMessagePayloadService {
  /**
   * Retrieves message payload
   * @param transferTransaction the blockchain transaction
   * @param accountPrivateKey the private key of either signer or recipient to read secure message
   * @return the message payload
   */
  public createMessagePayload(
    uploadParameter: UploadParameter,
    uploadedData: ProximaxDataModel
  ): ProximaxMessagePayloadModel {
    return new ProximaxMessagePayloadModel(
      uploadParameter.privacyStrategy.getPrivacyType(),
      uploadedData,
      uploadParameter.version
    );
  }
}
