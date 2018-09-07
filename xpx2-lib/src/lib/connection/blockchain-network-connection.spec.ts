import 'mocha';

import { expect } from 'chai';
import { BlockchainNetworkType } from '../model/blockchain/blockchain-network-type';
import { BlockchainNetworkConnection } from './blockchain-network-connection';

describe('BlockChainNetworkConnection', () => {
  it('should establish connection in the blockchain', async () => {
    const endPointUrl = 'http://172.24.231.91:3000';
    const gatewayUrl = 'http://172.24.231.91:9000';
    const blockchainConnection = new BlockchainNetworkConnection(
      BlockchainNetworkType.MIJIN_TEST,
      endPointUrl,
      gatewayUrl
    );
    await blockchainConnection.isConnect().subscribe(networkInfo => {
      console.log(networkInfo);
      expect(networkInfo.status).to.be.equal('Connected');
    });
  });

  it('should not establish connection in the blockchain', async () => {
    const endPointUrl = 'http://172.24.231.91:4000';
    const gatewayUrl = 'http://172.24.231.91:9000';
    const blockchainConnection = new BlockchainNetworkConnection(
      BlockchainNetworkType.MIJIN_TEST,
      endPointUrl,
      gatewayUrl
    );
    await blockchainConnection.isConnect().subscribe(networkInfo => {
      console.log(networkInfo);
      expect(networkInfo.status).to.be.equal('Disconnected');
    });
  });
});
