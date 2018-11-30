import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import 'mocha';
import { PrivacyType } from '../../src';
import { BlockchainNetworkConnection } from '../../src/lib/connection/blockchain-network-connection';
import { ConnectionConfig } from '../../src/lib/connection/connection-config';
import { IpfsConnection } from '../../src/lib/connection/ipfs-connection';
import { Protocol } from '../../src/lib/connection/protocol';
import { BlockchainNetworkType } from '../../src/lib/model/blockchain/blockchain-network-type';
import { UploadParameter } from '../../src/lib/upload/upload-parameter';
import { Uploader } from '../../src/lib/upload/uploader';
import {
  BlockchainInfo,
  IpfsInfo,
  RecipientAccount,
  SamplePassword,
  SenderAccount
} from '../integrationtestconfig';
import { TestDataRepository } from '../testdatarepository';

chai.use(chaiAsPromised);

describe('Uploader integration tests for privacy strategies', () => {
  const connectionConfig = ConnectionConfig.createWithLocalIpfsConnection(
    new BlockchainNetworkConnection(
      BlockchainNetworkType.MIJIN_TEST,
      BlockchainInfo.apiHost,
      BlockchainInfo.apiPort,
      Protocol.HTTP
    ),
    new IpfsConnection(IpfsInfo.multiaddress, IpfsInfo.port)
  );

  const uploader = new Uploader(connectionConfig);

  it('should upload with plain privacy', async () => {
    const param = UploadParameter.createForStringUpload(
      'Proximax P2P Uploader with plain privacy',
      SenderAccount.privateKey
    )
      .withPlainPrivacy()
      .build();

    const result = await uploader.upload(param);

    expect(result.transactionHash.length > 0).to.be.true;
    expect(result.data.dataHash.length > 0).to.be.true;
    expect(result.privacyType).to.be.equal(PrivacyType.PLAIN);

    TestDataRepository.logAndSaveResult(
      result,
      'shouldUploadWithPlainPrivacyStrategy'
    );
  }).timeout(10000);

  it('should upload secured with nem keys privacy', async () => {
    const param = UploadParameter.createForStringUpload(
      'Proximax P2P Uploader with nem keys privacy',
      SenderAccount.privateKey
    )
      .withNemKeysPrivacy(SenderAccount.privateKey, RecipientAccount.publicKey)
      .build();

    const result = await uploader.upload(param);

    expect(result.transactionHash.length > 0).to.be.true;
    expect(result.data.dataHash.length > 0).to.be.true;
    expect(result.privacyType).to.be.equal(PrivacyType.NEM_KEYS);

    TestDataRepository.logAndSaveResult(
      result,
      'shouldUploadWithSecuredWithNemKeysPrivacyStrategy'
    );
  }).timeout(10000);

  it('should upload secured with password privacy', async () => {
    const param = UploadParameter.createForStringUpload(
      'Proximax P2P Uploader with password privacy',
      SenderAccount.privateKey
    )
      .withPasswordPrivacy(SamplePassword)
      .build();

    const result = await uploader.upload(param);

    expect(result.transactionHash.length > 0).to.be.true;
    expect(result.data.dataHash.length > 0).to.be.true;
    expect(result.privacyType).to.be.equal(PrivacyType.PASSWORD);

    TestDataRepository.logAndSaveResult(
      result,
      'shouldUploadWithSecuredWithPasswordPrivacyStrategy'
    );
  }).timeout(10000);
});
