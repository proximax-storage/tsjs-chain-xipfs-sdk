import { NetworkType } from 'tsjs-xpx-chain-sdk';
import { Protocol } from '../connection/protocol';
import { BlockchainNetworkType } from '../model/blockchain/blockchain-network-type';

export class Converter {
  public static getBlockchainNetworkType(networkType: NetworkType): string {
    switch (networkType) {
      case NetworkType.MAIN_NET:
        return BlockchainNetworkType[BlockchainNetworkType.MAIN_NET];
      case NetworkType.MIJIN:
        return BlockchainNetworkType[BlockchainNetworkType.MIJIN];
      case NetworkType.MIJIN_TEST:
        return BlockchainNetworkType[BlockchainNetworkType.MIJIN_TEST];
      case NetworkType.TEST_NET:
        return BlockchainNetworkType[BlockchainNetworkType.TEST_NET];
      case NetworkType.PRIVATE_TEST:
        return BlockchainNetworkType[BlockchainNetworkType.PRIVATE_TEST];
      case NetworkType.PRIVATE:
        return BlockchainNetworkType[BlockchainNetworkType.PRIVATE];
    }
  }

  public static getNemNetworkType(
    blockchainNetworkType: BlockchainNetworkType
  ): NetworkType {
    switch (blockchainNetworkType) {
      case BlockchainNetworkType.MAIN_NET:
        return NetworkType.MAIN_NET;
      case BlockchainNetworkType.MIJIN:
        return NetworkType.MIJIN;
      case BlockchainNetworkType.TEST_NET:
        return NetworkType.TEST_NET;
      case BlockchainNetworkType.MIJIN_TEST:
        return NetworkType.MIJIN_TEST;
      case BlockchainNetworkType.PRIVATE:
        return NetworkType.PRIVATE;
      case BlockchainNetworkType.PRIVATE_TEST:
        return NetworkType.PRIVATE_TEST;
      default:
        return NetworkType.MIJIN_TEST;
    }
  }

  public static toBlockchainNetworkType(
    networkType: string
  ): BlockchainNetworkType {
    switch (networkType) {
      case 'MAIN_NET':
        return BlockchainNetworkType.MAIN_NET;
      case 'MIJIN':
        return BlockchainNetworkType.MIJIN;
      case 'MIJIN_TEST':
        return BlockchainNetworkType.MIJIN_TEST;
      case 'TEST_NET':
        return BlockchainNetworkType.TEST_NET;
      case 'PRIVATE_TEST':
        return BlockchainNetworkType.PRIVATE_TEST;
      case 'PRIVATE':
        return BlockchainNetworkType.PRIVATE;
      default:
        throw new Error('unknown network type ' + networkType);
    }
  }

  public static toProtocol(protocol: string): Protocol {
    switch (protocol.toLowerCase()) {
      case 'http':
        return Protocol.HTTP;
      case 'https':
        return Protocol.HTTPS;
      default:
        throw new Error('unknown protocol ' + protocol);
    }
  }
}
