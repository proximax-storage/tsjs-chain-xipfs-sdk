import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import 'mocha';
import {
  BlockchainNetworkConnection,
  BlockchainNetworkType,
  IpfsConnection
} from '../../src';
import { ConnectionConfig } from '../../src/lib/connection/connection-config';
import { Protocol } from '../../src/lib/connection/protocol';
import { SearchParameter } from '../../src/lib/search/search-parameter';
import { Searcher } from '../../src/lib/search/searcher';
import { BlockchainInfo, IpfsInfo } from '../integrationtestconfig';

chai.use(chaiAsPromised);

describe('Searcher integration tests for fromTransactionId', () => {
  const connectionConfig = ConnectionConfig.createWithLocalIpfsConnection(
    new BlockchainNetworkConnection(
      BlockchainNetworkType.MIJIN_TEST,
      BlockchainInfo.apiHost,
      BlockchainInfo.apiPort,
      Protocol.HTTP
    ),
    new IpfsConnection(IpfsInfo.multiaddress, IpfsInfo.port)
  );
  const searcher = new Searcher(connectionConfig);

  it('should search with from transaction id', async () => {
    const fromTransactionId = '5BDEDB565D6F4B0001155AFF';
    const expectedFirstTransactionHash =
      '471C6C6A3EAC3F18849C1CA2C06D532AA2A83D7E89D99858F52DEE6DCD0D3762';
    const param = SearchParameter.createForAddress(
      'SDB5DP6VGVNPSQJYEC2X3QIWKAFJ3DCMNQCIF6OA'
    )
      .withFromTransactionId(fromTransactionId)
      .build();

    const result = await searcher.search(param);

    expect(result.results.length).to.be.equal(10);
    expect(result.fromTransactionId).to.be.equal(fromTransactionId);
    expect(result.results[0].transactionHash).to.be.equal(
      expectedFirstTransactionHash
    );
  }).timeout(10000);
});
