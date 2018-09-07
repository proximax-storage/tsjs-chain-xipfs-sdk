import { NetworkHttp } from 'nem2-sdk';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Converter } from '../helper/converter';
import { NetworkInfo } from '../model/blockchain/network-info';
import { BlockchainNetworkType } from '../model/proximax/blockchain-network-type';

export class BlockchainNetworkConnection {
  constructor(
    public readonly network: BlockchainNetworkType,
    public readonly endpointUrl: string,
    public readonly gatewayUrl?: string
  ) {}

  public isConnect(): Observable<NetworkInfo> {
    const networkHttp = new NetworkHttp(this.endpointUrl);
    return networkHttp.getNetworkType().pipe(
      map(networkType => {
        if (!networkType) {
          return new NetworkInfo(
            BlockchainNetworkType[this.network],
            this.endpointUrl,
            this.gatewayUrl,
            'Disconnected'
          );
        }

        const bcNetwork = Converter.getBlockchainNetworkType(networkType);
        const status = 'Connected';
        return new NetworkInfo(
          bcNetwork,
          this.endpointUrl,
          this.gatewayUrl,
          status
        );
      })
    );
  }
}
