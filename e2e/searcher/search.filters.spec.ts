import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import 'mocha';
import {BlockchainNetworkConnection, BlockchainNetworkType, IpfsConnection} from '../../src';
import {ConnectionConfig} from '../../src/lib/connection/connection-config';
import {Protocol} from '../../src/lib/connection/protocol';
import {BlockchainInfo, IpfsInfo, SenderAccount} from '../integrationtestconfig';
import {SearchParameter} from "../../src/lib/search/search-parameter";
import {Searcher} from "../../src/lib/search/searcher";

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

  it('should search with name filter', async () => {
    const nameFilter= 'test name';
    const param = SearchParameter.createForAddress(SenderAccount.address)
      .withNameFilter(nameFilter)
      .build();

    const result = await searcher.search(param);

    expect(result.results.every(item => item.messagePayload.data.name!.includes(nameFilter))).to.be.true;
    expect(result.results.length).to.be.equal(10);
  }).timeout(10000);

  it('should search with description filter', async () => {
    const descriptionFilter = 'test description';
    const param = SearchParameter.createForAddress(SenderAccount.address)
      .withDescriptionFilter(descriptionFilter)
      .build();

    const result = await searcher.search(param);

    expect(result.results.every(item => item.messagePayload.data.description!.includes(descriptionFilter))).to.be.true;
    expect(result.results.length).to.be.equal(10);
  }).timeout(10000);

  it('should search with metadata key filter', async () => {
    const metadataKeyFilter = 'author';
    const param = SearchParameter.createForAddress(SenderAccount.address)
      .withMetadataKeyFilter(metadataKeyFilter)
      .build();

    const result = await searcher.search(param);

    expect(result.results.every(item => item.messagePayload.data.metadata!.get(metadataKeyFilter) !== undefined)).to.be.true;
    expect(result.results.length).to.be.equal(10);
  }).timeout(10000);

  it('should search with metadata key and value filter', async () => {
    const metadataKeyFilter = 'author';
    const metadataValueFilter = 'Proximax';
    const param = SearchParameter.createForAddress(SenderAccount.address)
      .withMetadataKeyFilter(metadataKeyFilter)
      .withMetadataValueFilter(metadataValueFilter)
      .build();

    const result = await searcher.search(param);

    expect(result.results.every(item => item.messagePayload.data.metadata!.get(metadataKeyFilter) === metadataValueFilter)).to.be.true;
    expect(result.results.length).to.be.equal(10);
  }).timeout(10000);

});
