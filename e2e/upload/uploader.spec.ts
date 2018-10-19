import { expect } from 'chai';
import 'mocha';
import { BlockchainNetworkConnection } from '../../src/lib/connection/blockchain-network-connection';
import { ConnectionConfig } from '../../src/lib/connection/connection-config';
import { IpfsConnection } from '../../src/lib/connection/ipfs-connection';
import { Protocol } from '../../src/lib/connection/protocol';
import { BlockchainNetworkType } from '../../src/lib/model/blockchain/blockchain-network-type';
import { Uint8ArrayParameterData } from '../../src/lib/upload/uint8-array-parameter-data';
import { UploadParameter } from '../../src/lib/upload/upload-parameter';
import { Uploader } from '../../src/lib/upload/uploader';
import {
  BlockchainInfo,
  IpfsInfo,
  RecipientAccount,
  SenderAccount
} from '../integrationtestconfig';

describe('Uploader integration tests', () => {
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

  it('should upload successfully', async () => {
    const byteStream = new Uint8Array(
      Buffer.from('Proximax P2P Uploader test')
    );
    const metadata = new Map<string, string>();
    metadata.set('author', 'Proximax');

    const paramData = Uint8ArrayParameterData.create(
      byteStream,
      'Test',
      'Test decription',
      'text/plain',
      metadata
    );

    const param = UploadParameter.createForUint8ArrayUpload(
      paramData,
      SenderAccount.privateKey
    )
      .withRecipientPublicKey(RecipientAccount.publicKey)
      .withRecipientAddress(RecipientAccount.address)
      .withPlainPrivacy()
      .withTransactionDeadline(2)
      .withUseBlockchainSecureMessage(false)
      .build();

    const result = await uploader.upload(param);

    expect(result.transactionHash.length > 0).to.be.true;
    expect(result.data.dataHash.length > 0).to.be.true;
  }).timeout(10000);
});
