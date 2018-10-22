import { expect } from 'chai';
import 'mocha';
import { BlockchainNetworkConnection } from '../../src/lib/connection/blockchain-network-connection';
import { ConnectionConfig } from '../../src/lib/connection/connection-config';
import { IpfsConnection } from '../../src/lib/connection/ipfs-connection';
import { Protocol } from '../../src/lib/connection/protocol';
import { BlockchainNetworkType } from '../../src/lib/model/blockchain/blockchain-network-type';
import { FileParameterData } from '../../src/lib/upload/file-parameter-data';
import { StringParameterData } from '../../src/lib/upload/string-parameter-data';
import { Uint8ArrayParameterData } from '../../src/lib/upload/uint8-array-parameter-data';
import { UploadParameter } from '../../src/lib/upload/upload-parameter';
import { Uploader } from '../../src/lib/upload/uploader';
import { UrlResourceParameterData } from '../../src/lib/upload/url-resource-parameter-data';
import {
  BlockchainInfo,
  IpfsInfo,
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

  it('should upload uint8 array', async () => {
    const byteStream = new Uint8Array(
      Buffer.from('Proximax P2P Uploader test')
    );

    const param = UploadParameter.createForUint8ArrayUpload(
      byteStream,
      SenderAccount.privateKey
    ).build();

    const result = await uploader.upload(param);

    expect(result.transactionHash.length > 0).to.be.true;
    expect(result.data.dataHash.length > 0).to.be.true;
    expect(result.data.contentType).to.be.undefined;
    expect(result.data.metadata).to.be.undefined;
    expect(result.data.description).to.be.undefined;
    expect(result.data.name).to.be.undefined;

    console.log(`Transaction Hash: ${result.transactionHash}`);
    console.log(`Data Hash: ${result.data.dataHash}`);
  }).timeout(10000);

  it('should upload uint8 array with complete details', async () => {
    const byteStream = new Uint8Array(
      Buffer.from('Proximax P2P Uploader test')
    );
    const metadata = new Map<string, string>();
    metadata.set('author', 'Proximax');

    const paramData = Uint8ArrayParameterData.create(
      byteStream,
      'test name',
      'test description',
      'text/plain',
      metadata
    );

    const param = UploadParameter.createForUint8ArrayUpload(
      paramData,
      SenderAccount.privateKey
    ).build();

    const result = await uploader.upload(param);

    expect(result.transactionHash.length > 0).to.be.true;
    expect(result.data.dataHash.length > 0).to.be.true;
    expect(result.data.contentType).to.be.equal('text/plain');
    expect(result.data.metadata).to.be.equal(metadata);
    expect(result.data.description).to.be.equal('test description');
    expect(result.data.name).to.be.equal('test name');

    console.log(`Transaction Hash: ${result.transactionHash}`);
    console.log(`Data Hash: ${result.data.dataHash}`);
  }).timeout(10000);

  it('should upload file', async () => {
    const param = UploadParameter.createForFileUpload(
      './e2e/testresources/test_pdf_file_2.pdf',
      SenderAccount.privateKey
    ).build();

    const result = await uploader.upload(param);

    expect(result.transactionHash.length > 0).to.be.true;
    expect(result.data.dataHash.length > 0).to.be.true;
    expect(result.data.contentType).to.be.undefined;
    expect(result.data.metadata).to.be.undefined;
    expect(result.data.description).to.be.undefined;
    expect(result.data.name).to.be.undefined;

    console.log(`Transaction Hash: ${result.transactionHash}`);
    console.log(`Data Hash: ${result.data.dataHash}`);
  }).timeout(10000);

  it('should upload file with complete details', async () => {
    const metadata = new Map<string, string>();
    metadata.set('author', 'Proximax');

    const paramData = FileParameterData.create(
      './e2e/testresources/test_pdf_file_2.pdf',
      'test name',
      'test description',
      'application/pdf',
      metadata
    );

    const param = UploadParameter.createForFileUpload(
      paramData,
      SenderAccount.privateKey
    ).build();

    const result = await uploader.upload(param);

    expect(result.transactionHash.length > 0).to.be.true;
    expect(result.data.dataHash.length > 0).to.be.true;
    expect(result.data.contentType).to.be.equal('application/pdf');
    expect(result.data.metadata).to.be.equal(metadata);
    expect(result.data.description).to.be.equal('test description');
    expect(result.data.name).to.be.equal('test name');

    console.log(`Transaction Hash: ${result.transactionHash}`);
    console.log(`Data Hash: ${result.data.dataHash}`);
  }).timeout(10000);

  it('should upload url resource', async () => {
    const param = UploadParameter.createForUrlResourceUpload(
      'https://proximax.io/wp-content/uploads/2018/03/ProximaX-logotype.png',
      SenderAccount.privateKey
    ).build();

    const result = await uploader.upload(param);

    expect(result.transactionHash.length > 0).to.be.true;
    expect(result.data.dataHash.length > 0).to.be.true;
    expect(result.data.contentType).to.be.undefined;
    expect(result.data.metadata).to.be.undefined;
    expect(result.data.description).to.be.undefined;
    expect(result.data.name).to.be.undefined;

    console.log(`Transaction Hash: ${result.transactionHash}`);
    console.log(`Data Hash: ${result.data.dataHash}`);
  }).timeout(10000);

  it('should upload url resource with complete details', async () => {
    const metadata = new Map<string, string>();
    metadata.set('author', 'Proximax');

    const paramData = UrlResourceParameterData.create(
      'https://proximax.io/wp-content/uploads/2018/03/ProximaX-logotype.png',
      'test name',
      'test description',
      'image/png',
      metadata
    );

    const param = UploadParameter.createForUrlResourceUpload(
      paramData,
      SenderAccount.privateKey
    ).build();

    const result = await uploader.upload(param);

    expect(result.transactionHash.length > 0).to.be.true;
    expect(result.data.dataHash.length > 0).to.be.true;
    expect(result.data.contentType).to.be.equal('image/png');
    expect(result.data.metadata).to.be.equal(metadata);
    expect(result.data.description).to.be.equal('test description');
    expect(result.data.name).to.be.equal('test name');

    console.log(`Transaction Hash: ${result.transactionHash}`);
    console.log(`Data Hash: ${result.data.dataHash}`);
  }).timeout(10000);

  it('should upload string', async () => {
    const param = UploadParameter.createForStringUpload(
      'the quick brown fox jumps over the lazy dog',
      SenderAccount.privateKey
    ).build();

    const result = await uploader.upload(param);

    expect(result.transactionHash.length > 0).to.be.true;
    expect(result.data.dataHash.length > 0).to.be.true;
    expect(result.data.contentType).to.be.undefined;
    expect(result.data.metadata).to.be.undefined;
    expect(result.data.description).to.be.undefined;
    expect(result.data.name).to.be.undefined;

    console.log(`Transaction Hash: ${result.transactionHash}`);
    console.log(`Data Hash: ${result.data.dataHash}`);
  }).timeout(10000);

  it('should upload string with complete details', async () => {
    const metadata = new Map<string, string>();
    metadata.set('author', 'Proximax');

    const paramData = StringParameterData.create(
      'the quick brown fox jumps over the lazy dog',
      'utf8',
      'test name',
      'test description',
      'text/plain',
      metadata
    );

    const param = UploadParameter.createForStringUpload(
      paramData,
      SenderAccount.privateKey
    ).build();

    const result = await uploader.upload(param);

    expect(result.transactionHash.length > 0).to.be.true;
    expect(result.data.dataHash.length > 0).to.be.true;
    expect(result.data.contentType).to.be.equal('text/plain');
    expect(result.data.metadata).to.be.equal(metadata);
    expect(result.data.description).to.be.equal('test description');
    expect(result.data.name).to.be.equal('test name');

    console.log(`Transaction Hash: ${result.transactionHash}`);
    console.log(`Data Hash: ${result.data.dataHash}`);
  }).timeout(10000);
});
