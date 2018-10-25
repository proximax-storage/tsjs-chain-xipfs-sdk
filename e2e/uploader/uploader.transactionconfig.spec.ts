import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { ChronoUnit } from 'js-joda';
import 'mocha';
import {
  Account,
  Deadline,
  Listener,
  Mosaic,
  MosaicId,
  Transaction,
  TransferTransaction,
  UInt64
} from 'proximax-nem2-sdk';
import { filter, take } from 'rxjs/operators';
import { Converter } from '../../src';
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
  NoFundsAccount,
  RecipientAccount,
  SenderAccount
} from '../integrationtestconfig';

chai.use(chaiAsPromised);

describe('Uploader integration tests for transaction config', () => {
  const blockchainNetworkConnection = new BlockchainNetworkConnection(
    BlockchainNetworkType.MIJIN_TEST,
    BlockchainInfo.apiHost,
    BlockchainInfo.apiPort,
    Protocol.HTTP
  );
  const connectionConfig = ConnectionConfig.createWithLocalIpfsConnection(
    blockchainNetworkConnection,
    new IpfsConnection(IpfsInfo.multiaddress, IpfsInfo.port)
  );

  const uploader = new Uploader(connectionConfig);

  it('should upload with signer as recipient by default', async () => {
    const param = UploadParameter.createForUint8ArrayUpload(
      new Uint8Array(Buffer.from('Proximax P2P Uploader')),
      SenderAccount.privateKey
    ).build();

    const result = await uploader.upload(param);
    const transaction = await waitForTransactionConfirmation(
      SenderAccount.privateKey,
      result.transactionHash
    );

    expect(result.transactionHash.length > 0).to.be.true;
    expect(result.data.dataHash.length > 0).to.be.true;
    expect(transaction instanceof TransferTransaction).to.be.true;
    expect((transaction as TransferTransaction).recipient.plain()).to.be.equal(
      SenderAccount.address
    );
  }).timeout(30000);

  it('should upload with recipient public key', async () => {
    const param = UploadParameter.createForUint8ArrayUpload(
      new Uint8Array(Buffer.from('Proximax P2P Uploader')),
      SenderAccount.privateKey
    )
      .withRecipientPublicKey(RecipientAccount.publicKey)
      .build();

    const result = await uploader.upload(param);
    const transaction = await waitForTransactionConfirmation(
      SenderAccount.privateKey,
      result.transactionHash
    );

    expect(result.transactionHash.length > 0).to.be.true;
    expect(result.data.dataHash.length > 0).to.be.true;
    expect(transaction instanceof TransferTransaction).to.be.true;
    expect((transaction as TransferTransaction).recipient.plain()).to.be.equal(
      RecipientAccount.address
    );
  }).timeout(60000);

  it('should upload with recipient address', async () => {
    const param = UploadParameter.createForUint8ArrayUpload(
      new Uint8Array(Buffer.from('Proximax P2P Uploader')),
      SenderAccount.privateKey
    )
      .withRecipientAddress(RecipientAccount.address)
      .build();

    const result = await uploader.upload(param);
    const transaction = await waitForTransactionConfirmation(
      SenderAccount.privateKey,
      result.transactionHash
    );

    expect(result.transactionHash.length > 0).to.be.true;
    expect(result.data.dataHash.length > 0).to.be.true;
    expect(transaction instanceof TransferTransaction).to.be.true;
    expect((transaction as TransferTransaction).recipient.plain()).to.be.equal(
      RecipientAccount.address
    );
  }).timeout(60000);

  it('should fail on insufficient funds', async () => {
    const byteStream = new Uint8Array(
      Buffer.from('Proximax P2P Uploader test')
    );

    const param = UploadParameter.createForUint8ArrayUpload(
      byteStream,
      NoFundsAccount.privateKey
    ).build();

    expect(uploader.upload(param)).to.be.rejectedWith(Error);
  }).timeout(60000);

  it('should upload with transaction deadline', async () => {
    const param = UploadParameter.createForUint8ArrayUpload(
      new Uint8Array(Buffer.from('Proximax P2P Uploader')),
      SenderAccount.privateKey
    )
      .withTransactionDeadline(2)
      .build();

    const result = await uploader.upload(param);
    const transaction = await waitForTransactionConfirmation(
      SenderAccount.privateKey,
      result.transactionHash
    );

    expect(result.transactionHash.length > 0).to.be.true;
    expect(result.data.dataHash.length > 0).to.be.true;
    expect(transaction instanceof TransferTransaction).to.be.true;
    expect(
      transaction.deadline.value.isBefore(
        Deadline.create(2, ChronoUnit.HOURS).value
      )
    ).to.be.true;
  }).timeout(60000);

  it('should upload with transaction mosaics', async () => {
    const param = UploadParameter.createForUint8ArrayUpload(
      new Uint8Array(Buffer.from('Proximax P2P Uploader')),
      SenderAccount.privateKey
    )
      .withTransactionMosaics([
        new Mosaic(new MosaicId('prx:xpx'), UInt64.fromUint(2))
      ])
      .build();

    const result = await uploader.upload(param);
    const transaction = await waitForTransactionConfirmation(
      SenderAccount.privateKey,
      result.transactionHash
    );

    expect(result.transactionHash.length > 0).to.be.true;
    expect(result.data.dataHash.length > 0).to.be.true;
    expect(transaction instanceof TransferTransaction).to.be.true;
    expect((transaction as TransferTransaction).mosaics.length === 1).to.be
      .true;
    expect((transaction as TransferTransaction).mosaics[0].amount).to.be.eql(
      UInt64.fromUint(2)
    );
    expect(
      (transaction as TransferTransaction).mosaics[0].id.id.toHex()
    ).to.be.eql(new MosaicId('prx:xpx').id.toHex());
  }).timeout(60000);

  it('should upload with empty transaction mosaics', async () => {
    const param = UploadParameter.createForUint8ArrayUpload(
      new Uint8Array(Buffer.from('Proximax P2P Uploader')),
      SenderAccount.privateKey
    )
      .withTransactionMosaics([])
      .build();

    const result = await uploader.upload(param);
    const transaction = await waitForTransactionConfirmation(
      SenderAccount.privateKey,
      result.transactionHash
    );

    expect(result.transactionHash.length > 0).to.be.true;
    expect(result.data.dataHash.length > 0).to.be.true;
    expect(transaction instanceof TransferTransaction).to.be.true;
    expect((transaction as TransferTransaction).mosaics).to.be.eql([]);
  }).timeout(60000);

  const waitForTransactionConfirmation = async (
    senderPrivateKey: string,
    transactionHash: string
  ): Promise<Transaction> => {
    try {
      const listener = new Listener(
        blockchainNetworkConnection.getApiUrl().replace('http://', 'ws://')
      );

      await listener.open();
      const transaction = await listener
        .confirmed(
          Account.createFromPrivateKey(
            senderPrivateKey,
            Converter.getNemNetworkType(blockchainNetworkConnection.networkType)
          ).address
        )
        .pipe(
          filter(
            confirmed => confirmed.transactionInfo!.hash === transactionHash
          ),
          take(1)
        )
        .toPromise();

      listener.close();
      return transaction;
    } catch (err) {
      throw new Error('Failed to listen on confirmed transaction');
    }
  };
});
