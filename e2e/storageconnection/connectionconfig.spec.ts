import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import 'mocha';
import { StorageConnection } from '../../src/index';
import { ConnectionConfig } from '../../src/lib/connection/connection-config';
import { StorageNodeApi } from '../integrationtestconfig';

chai.use(chaiAsPromised);

describe('Connection config integration tests', () => {
  it('should initialize blockchain network connection with just storage connnection', async () => {
    const connectionConfig = await ConnectionConfig.createWithStorageConnectionOnly(
      new StorageConnection(
        StorageNodeApi.apiHost,
        StorageNodeApi.apiPort,
        StorageNodeApi.apiProtocol,
        StorageNodeApi.bearerToken,
        StorageNodeApi.nemAddress
      )
    );

    expect(connectionConfig).to.be.not.null;
    expect(connectionConfig.blockchainNetworkConnection).to.be.not.null;
    expect(connectionConfig.blockchainNetworkConnection.apiHost).to.be.not.null;
    expect(connectionConfig.blockchainNetworkConnection.apiPort).to.be.not.null;
    expect(connectionConfig.blockchainNetworkConnection.apiProtocol).to.be.not
      .null;
    expect(connectionConfig.blockchainNetworkConnection.networkType).to.be.not
      .null;
    expect(connectionConfig.blockchainNetworkConnection.getApiUrl()).to.be.not
      .null;
  }).timeout(10000);
});
