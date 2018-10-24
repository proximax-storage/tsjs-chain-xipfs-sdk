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
import {
  BlockchainInfo,
  IpfsInfo,
  SenderAccount
} from '../integrationtestconfig';

chai.use(chaiAsPromised);

describe('Searcher integration tests', () => {
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
    const fromTransactionId = '5BCEC7EBB8FEBD00014E9886';
    const expectedFirstTransactionHash =
      '62E9E9D0AA6BDE8D3AB2D7B6A8B97C220C37696CA46E81148C631229563DC953';
    const param = SearchParameter.createForAddress(SenderAccount.address)
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
