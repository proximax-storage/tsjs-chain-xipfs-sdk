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

  it('should search with account address', async () => {
    const param = SearchParameter.createForAddress(SenderAccount.address).build();

    const result = await searcher.search(param);

    expect(result.results.length).to.be.equal(10);
    expect(result.toTransactionId !== undefined).to.be.true;
    expect(result.fromTransactionId).to.be.undefined;
  }).timeout(10000);

  it('should search with account public key', async () => {
    const param = SearchParameter.createForPublicKey(SenderAccount.publicKey).build();

    const result = await searcher.search(param);

    expect(result.results.length).to.be.equal(10);
    expect(result.toTransactionId !== undefined).to.be.true;
    expect(result.fromTransactionId).to.be.undefined;
  }).timeout(10000);

  it('should search with account private key', async () => {
    const param = SearchParameter.createForPrivateKey(SenderAccount.privateKey).build();

    const result = await searcher.search(param);

    expect(result.results.length).to.be.equal(10);
    expect(result.toTransactionId !== undefined).to.be.true;
    expect(result.fromTransactionId).to.be.undefined;
  }).timeout(10000);

});
