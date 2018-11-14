import { Account, NetworkType, PublicAccount } from 'proximax-nem2-sdk';
import { Converter } from '../helper/converter';
import { BlockchainNetworkType } from '../model/blockchain/blockchain-network-type';

/**
 * NemUtils
 */
export class NemUtils {
  /**
   * Nem network type
   */
  private networkType: NetworkType;

  /**
   * Constructor
   * @param blockchainNetworkType the blockchain network type
   */
  constructor(blockchainNetworkType: BlockchainNetworkType) {
    this.networkType = Converter.getNemNetworkType(blockchainNetworkType);
  }

  /**
   * Generates a new account
   */
  public generateAccount(): Account {
    return Account.generateNewAccount(this.networkType);
  }

  /**
   * Get account from the private key
   * @param privateKey the private key
   */
  public getAccount(privateKey: string): Account {
    return Account.createFromPrivateKey(privateKey, this.networkType);
  }

  /**
   * Get the public account from public key
   * @param publicKey the public key
   */
  public getPublicAccount(publicKey: string): PublicAccount {
    return PublicAccount.createFromPublicKey(publicKey, this.networkType);
  }
}
