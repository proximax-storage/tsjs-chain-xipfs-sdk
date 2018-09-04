import { PrivacyType } from '../privacy/privacy-type';

export class ProximaxMessagePayloadModel {
  constructor(
    /**
     * Message digest signature using SHA-256
     */
    public digest?: string,
    /**
     * Hash from IPFS
     */
    public rootDataHash?: string,
    /**
     * The privacy strategy type
     */
    public privacyType?: PrivacyType,
    /**
     * The privacy search tag configuration
     */
    public privacySearchTag?: string,
    /**
     * The description
     */
    public description?: string,
    /**
     * Indicates the schema version of message payload
     */
    public version?: string
  ) {}
}
