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
import { TransactionFilter } from '../../src/lib/model/blockchain/transaction-filter';
import { SearchParameter } from '../../src/lib/search/search-parameter';
import { Searcher } from '../../src/lib/search/searcher';
import {
  BlockchainInfo,
  IpfsInfo,
  RecipientAccount,
  SenderAccount
} from '../integrationtestconfig';

chai.use(chaiAsPromised);

describe('Searcher integration tests for transactionFilter', () => {
  const connectionConfig = ConnectionConfig.createWithLocalIpfsConnection(
    new BlockchainNetworkConnection(
      BlockchainNetworkType.MIJIN_TEST,
      BlockchainInfo.apiHost,
      BlockchainInfo.apiPort,
      Protocol.HTTP
    ),
    new IpfsConnection(IpfsInfo.host, IpfsInfo.port)
  );
  const searcher = new Searcher(connectionConfig);

  it('should search outgoing transactions', async () => {
    const param = SearchParameter.createForAddress(SenderAccount.address)
      .withTransactionFilter(TransactionFilter.OUTGOING)
      .build();

    const result = await searcher.search(param);

    expect(result.results.length).to.be.equal(10);
  }).timeout(10000);

  it('should search incoming transactions', async () => {
    const param = SearchParameter.createForAddress(RecipientAccount.address)
      .withTransactionFilter(TransactionFilter.INCOMING)
      .build();

    const result = await searcher.search(param);

    expect(result.results.length).to.be.equal(10);
  }).timeout(10000);

  it('should search all transactions', async () => {
    const param = SearchParameter.createForAddress(RecipientAccount.address)
      .withTransactionFilter(TransactionFilter.ALL)
      .build();

    const result = await searcher.search(param);

    expect(result.results.length).to.be.equal(10);
  }).timeout(10000);
});
