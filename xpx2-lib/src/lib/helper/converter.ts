import { NetworkType } from 'nem2-sdk';
import { BlockchainNetworkType } from '../model/blockchain/blockchain-network-type';

export class Converter {
  public static getBlockchainNetworkType(nemNetworkType: NetworkType): string {
    switch (nemNetworkType) {
      case NetworkType.MAIN_NET:
        return BlockchainNetworkType[BlockchainNetworkType.MAIN_NET];
      case NetworkType.MIJIN:
        return BlockchainNetworkType[BlockchainNetworkType.MIJIN];
      case NetworkType.MIJIN_TEST:
        return BlockchainNetworkType[BlockchainNetworkType.MIJIN_TEST];
      case NetworkType.TEST_NET:
        return BlockchainNetworkType[BlockchainNetworkType.TEST_NET];
    }
  }
}
