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

describe('Searcher integration tests for resultSize', () => {
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

  it('should search with no specified result size', async () => {
    const param = SearchParameter.createForAddress(
      SenderAccount.address
    ).build();

    const result = await searcher.search(param);

    expect(result.results.length).to.be.equal(10);
  }).timeout(10000);

  it('should search with 1 result size', async () => {
    const param = SearchParameter.createForAddress(SenderAccount.address)
      .withResultSize(1)
      .build();

    const result = await searcher.search(param);

    expect(result.results.length).to.be.equal(1);
  }).timeout(10000);

  it('should search with 20 result size', async () => {
    const param = SearchParameter.createForAddress(SenderAccount.address)
      .withResultSize(20)
      .build();

    const result = await searcher.search(param);

    expect(result.results.length).to.be.equal(20);
  }).timeout(10000);

  it('failed trying to search more than 20 result size', async () => {
    expect(() =>
      SearchParameter.createForAddress(SenderAccount.address).withResultSize(21)
    ).to.throw();
  }).timeout(10000);

  it('failed trying to search less than 1 result size', async () => {
    expect(() =>
      SearchParameter.createForAddress(SenderAccount.address).withResultSize(0)
    ).to.throw();
  }).timeout(10000);
});
