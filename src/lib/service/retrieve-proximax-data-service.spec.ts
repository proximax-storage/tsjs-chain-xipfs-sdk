import 'mocha';
import { BlockchainInfo, IpfsInfo } from '../config/testconfig';
import { IpfsConnection } from '../connection/ipfs-connection';
import { Protocol } from '../connection/protocol';
import { RetrieveProximaxDataService } from './retrieve-proximax-data-service';

import { expect } from 'chai';
import { BlockchainNetworkConnection } from '../connection/blockchain-network-connection';
import { ConnectionConfig } from '../connection/connection-config';
import { BlockchainNetworkType } from '../model/blockchain/blockchain-network-type';
import { PlainPrivacyStrategy } from '../privacy/plain-privacy';

describe('RetrieveProximaxDataService', () => {
  it('should get stream with datahash', async () => {
    const connectionConfig = ConnectionConfig.createWithLocalIpfsConnection(
      new BlockchainNetworkConnection(
        BlockchainNetworkType.MIJIN_TEST,
        BlockchainInfo.apiHost,
        BlockchainInfo.apiPort,
        Protocol.HTTP
      ),
      new IpfsConnection(IpfsInfo.multiaddress, IpfsInfo.port)
    );

    const retrieveProximaxDataService = new RetrieveProximaxDataService(
      connectionConfig
    );
    const expectedContent = 'Proximax P2P CreateProximaxDataService';

    const dataHash = 'QmVjQMmQu79Q751eSVHDuR6QHtTAAGvEhexPUwRmotjzm5';
    await retrieveProximaxDataService
      .getStream(
        dataHash,
        PlainPrivacyStrategy.create(),
        false,
        '',
        'text/plain'
      )
      .subscribe(response => {
        const content = Buffer.from(response).toString('utf8');
        expect(content).to.be.equal(expectedContent);
      });
  });
});
