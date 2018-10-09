import { AccountHttp, Address } from '@thomas.tran/nem2-sdk';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BlockchainNetworkConnection } from '../../../connection/blockchain-network-connection';

export class AccountClient {
  private accountHttp: AccountHttp;

  constructor(blockchainNetworkConnection: BlockchainNetworkConnection) {
    if (blockchainNetworkConnection === null) {
      throw new Error('blockchain network connection is required');
    }

    this.accountHttp = new AccountHttp(blockchainNetworkConnection.getApiUrl());
  }

  public getPublicKey(address: string): Observable<string> {
    if (address === null || address.length <= 0) {
      throw new Error('address is required');
    }

    const bcAddress = Address.createFromRawAddress(address);
    return this.accountHttp.getAccountInfo(bcAddress).pipe(
      map(accountInfo => {
        return accountInfo.publicKey;
      })
    );
  }
}
