import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import 'mocha';
import {
  BlockchainNetworkConnection,
  BlockchainNetworkType,
  StorageConnection,
  Uploader,
  UploadParameter
} from '../../src/index';
import { ConnectionConfig } from '../../src/lib/connection/connection-config';
import { Protocol } from '../../src/lib/connection/protocol';
import {
  BlockchainInfo,
  SenderAccount,
  StorageNodeApi
} from '../integrationtestconfig';

chai.use(chaiAsPromised);

describe('Uploader integration tests for storage connection', () => {
  const connectionConfig = ConnectionConfig.createWithStorageConnection(
    new BlockchainNetworkConnection(
      BlockchainNetworkType.MIJIN_TEST,
      BlockchainInfo.apiHost,
      BlockchainInfo.apiPort,
      Protocol.HTTP
    ),
    new StorageConnection(
      StorageNodeApi.apiHost,
      StorageNodeApi.apiPort,
      StorageNodeApi.apiProtocol,
      StorageNodeApi.bearerToken,
      StorageNodeApi.nemAddress
    )
  );
  const uploader = new Uploader(connectionConfig);

  it('should download from storage connection', async () => {
    const param = UploadParameter.createForStringUpload(
      'the quick brown fox jumps over the lazy dog',
      SenderAccount.privateKey
    ).build();

    const result = await uploader.upload(param);

    expect(result.data.dataHash.length > 0).to.be.true;
  }).timeout(10000);
});
