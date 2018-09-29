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
      default:
        return NetworkType.MIJIN_TEST;
    }
  }

  public static concatenate(resultConstructor, ...arrays) {
    let totalLength = 0;
    for (const arr of arrays) {
      totalLength += arr.length;
    }
    const result = new resultConstructor(totalLength);
    let offset = 0;
    for (const arr of arrays) {
      result.set(arr, offset);
      offset += arr.length;
    }
    return result;
  }

  public static ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint16Array(buf));
  }

  public static str2ab(str) {
    const buf = new ArrayBuffer(str.length * 2);
    const bufView = new Uint16Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return buf;
  }

  public static isHex(h: string) {
    const a = parseInt(h, 16);
    return a.toString(16) === h.toLowerCase();
  }
}
