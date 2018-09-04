import { BlockchainNetworkType } from "../model/proximax/blockchain-network-type";


export class BlockchainNetworkConnection {
  constructor(
    public readonly network: BlockchainNetworkType,
    public readonly endpointUrl: string,
    public readonly gatewayUrl?: string
  ) {}
}
