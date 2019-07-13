import { TransferTransaction } from 'tsjs-xpx-chain-sdk';
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
   * @param blockchainNetworkConnection the blockchain connection config
   */
  constructor(
    public readonly blockchainNetworkConnection: BlockchainNetworkConnection
  ) {
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
    accountPrivateKey?: string
  ): Promise<ProximaxMessagePayloadModel> {
    const payload = await this.blockchainMessageService.getMessagePayload(
      transferTransaction,
      accountPrivateKey
    );
    return JSON.parse(
      payload,
      (key, value) => (key === 'metadata' ? this.toMap(value) : value)
    );
  }

  private toMap(obj: object): Map<string, string> {
    const map = new Map<string, string>();
    if (obj) {
      Object.keys(obj).forEach(key => map.set(key, obj[key]));
    }
    return map;
  }
}
