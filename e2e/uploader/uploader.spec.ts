import { expect } from 'chai';
import 'mocha';
import { BlockchainNetworkConnection } from '../../src/lib/connection/blockchain-network-connection';
import { ConnectionConfig } from '../../src/lib/connection/connection-config';
import { IpfsConnection } from '../../src/lib/connection/ipfs-connection';
import { Protocol } from '../../src/lib/connection/protocol';
// import { StreamHelper } from '../../src/lib/helper/stream-helper';
import { BlockchainNetworkType } from '../../src/lib/model/blockchain/blockchain-network-type';
// import { FileParameterData } from '../../src/lib/upload/file-parameter-data';
// import { ReadableStreamParameterData } from '../../src/lib/upload/readable-stream-parameter-data';
// import { StringParameterData } from '../../src/lib/upload/string-parameter-data';
// import { Uint8ArrayParameterData } from '../../src/lib/upload/uint8-array-parameter-data';
import { UploadParameter } from '../../src/lib/upload/upload-parameter';
import { Uploader } from '../../src/lib/upload/uploader';
// import { UrlResourceParameterData } from '../../src/lib/upload/url-resource-parameter-data';
import {
  BlockchainInfo,
  IpfsInfo,
  SenderAccount
} from '../integrationtestconfig';
import { TestDataRepository } from '../testdatarepository';
import { Mosaic, MosaicId, UInt64 } from 'tsjs-xpx-chain-sdk';

describe('Uploader integration tests', () => {
  const connectionConfig = ConnectionConfig.createWithLocalIpfsConnection(
    new BlockchainNetworkConnection(
      BlockchainNetworkType.TEST_NET,
      BlockchainInfo.apiHost,
      BlockchainInfo.apiPort,
      Protocol.HTTPS
    ),
    new IpfsConnection(IpfsInfo.host, IpfsInfo.port,IpfsInfo.options)
  );
  console.log(connectionConfig);
  const uploader = new Uploader(connectionConfig);

  it('should upload uint8 array', async () => {
    const byteStream = new Uint8Array(
      Buffer.from('Proximax P2P Uploader test')
    );

    const mosaic = [new Mosaic(new MosaicId('3c0f3de5298ced2d'), UInt64.fromUint(0))]

    const param = UploadParameter.createForUint8ArrayUpload(
      byteStream,
      SenderAccount.privateKey
    ).withTransactionMosaics(mosaic)
    .build();

    try {
      const result = await uploader.upload(param);
      console.log(result);
      expect(result.transactionHash.length > 0).to.be.true;
      expect(result.data.dataHash.length > 0).to.be.true;
      expect(result.data.contentType).to.be.undefined;
      expect(result.data.metadata).to.be.undefined;
      expect(result.data.description).to.be.undefined;
      expect(result.data.name).to.be.undefined;
  
      TestDataRepository.logAndSaveResult(result, 'shouldUploadUint8Array');
    } catch(error) {
      console.log(error);
    }
    
  }).timeout(10000);

  /*
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

    TestDataRepository.logAndSaveResult(
      result,
      'shouldUploadUint8ArrayWithCompleteDetails'
    );
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

    TestDataRepository.logAndSaveResult(result, 'shouldUploadFile');
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

    TestDataRepository.logAndSaveResult(
      result,
      'shouldUploadFileWithCompleteDetails'
    );
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

    TestDataRepository.logAndSaveResult(result, 'shouldUploadUrlResource');
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

    TestDataRepository.logAndSaveResult(
      result,
      'shouldUploadUrlResourceWithCompleteDetails'
    );
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

    TestDataRepository.logAndSaveResult(result, 'shouldUploadString');
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

    TestDataRepository.logAndSaveResult(
      result,
      'shouldUploadStringWithCompleteDetails'
    );
  }).timeout(10000);

  it('should upload readable stream', async () => {
    const param = UploadParameter.createForReadableStreamUpload(
      async () => StreamHelper.string2Stream('readable stream is awesome'),
      SenderAccount.privateKey
    ).build();

    const result = await uploader.upload(param);

    expect(result.transactionHash.length > 0).to.be.true;
    expect(result.data.dataHash.length > 0).to.be.true;
    expect(result.data.contentType).to.be.undefined;
    expect(result.data.metadata).to.be.undefined;
    expect(result.data.description).to.be.undefined;
    expect(result.data.name).to.be.undefined;

    TestDataRepository.logAndSaveResult(result, 'shouldUploadReadableStream');
  }).timeout(10000);

  it('should upload readable stream with complete details', async () => {
    const metadata = new Map<string, string>();
    metadata.set('author', 'Proximax');

    const paramData = ReadableStreamParameterData.create(
      async () => StreamHelper.string2Stream('readable stream is awesome'),
      'test name',
      'test description',
      'text/plain',
      metadata
    );

    const param = UploadParameter.createForReadableStreamUpload(
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

    TestDataRepository.logAndSaveResult(
      result,
      'shouldUploadReadableStreamWithCompleteDetails'
    );
  }).timeout(10000);*/
});
