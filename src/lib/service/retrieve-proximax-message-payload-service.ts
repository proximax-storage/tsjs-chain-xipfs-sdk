import { TransferTransaction } from 'proximax-nem2-sdk';
import {
  BlockchainNetworkConnection,
  ProximaxMessagePayloadModel
} from '../..';
import { BlockchainMessageService } from './blockchain-message-service';

/**
 * The service class responsible for retrieving message payload from transaction
 */
export class RetrieveProximaxMessagePayloadService {
  private readonly blockchainMessageService: BlockchainMessageService;

  /**
   * Construct this class
   *
   * @param connectionConfig the connection config
   */
  constructor(blockchainNetworkConnection: BlockchainNetworkConnection) {
    this.blockchainMessageService = new BlockchainMessageService(
      blockchainNetworkConnection
    );
  }

  /**
   * Retrieves message payload
   * @param transferTransaction the blockchain transaction
   * @param accountPrivateKey the private key of either signer or recipient to read secure message
   * @return the message payload
   */
  public async getMessagePayload(
    transferTransaction: TransferTransaction,
    accountPrivateKey: string
  ): Promise<ProximaxMessagePayloadModel> {
    const payload = await this.blockchainMessageService.getMessagePayload(
      transferTransaction,
      accountPrivateKey
    );
    return JSON.parse(payload);
  }
}
