// import { expect } from 'chai';
// import 'mocha';
// import { SchemaVersion } from '../config/config';
// import {
//   BlockchainInfo,
//   IpfsInfo,
//   RecipientAccount,
//   SenderAccount
// } from '../config/config.spec';
// import { BlockchainNetworkConnection } from '../connection/blockchain-network-connection';
// import { ConnectionConfig } from '../connection/connection-config';
// import { IpfsConnection } from '../connection/ipfs-connection';
// import { Protocol } from '../connection/protocol';
// import { BlockchainNetworkType } from '../model/blockchain/blockchain-network-type';
//
// import { PlainPrivacyStrategy } from '../privacy/plain-privacy';
// import { UploadParameter } from './upload-parameter';
// import { UploadParameterData } from './upload-parameter-data';
// import { Uploader } from './uploader';
//
// describe('Uploader', () => {
//   it('should return upload result', async () => {
//     const connectionConfig = ConnectionConfig.createWithLocalIpfsConnection(
//       new BlockchainNetworkConnection(
//         BlockchainNetworkType.MIJIN_TEST,
//         BlockchainInfo.apiHost,
//         BlockchainInfo.apiPort,
//         Protocol.HTTP
//       ),
//       new IpfsConnection(IpfsInfo.multiaddress, IpfsInfo.port)
//     );
//
//     const byteStream = Buffer.from('Proximax P2P Uploader test');
//     const metadata = new Map<string, string>();
//     metadata.set('author', 'Proximax');
//     const paramData = new UploadParameterData(
//       'Test',
//       'Test decription',
//       'text/plain',
//       metadata,
//       byteStream
//     );
//
//     const param = new UploadParameter(
//       paramData,
//       SenderAccount.privateKey,
//       RecipientAccount.publicKey,
//       RecipientAccount.address,
//       PlainPrivacyStrategy.create(),
//       1,
//       false,
//       true,
//       true,
//       SchemaVersion
//     );
//
//     const uploader = new Uploader(connectionConfig);
//     await uploader.upload(param).then(response => {
//       console.log(response);
//       expect(response.transactionHash.length > 0).to.be.true;
//       expect(response.data.dataHash.length > 0).to.be.true;
//     });
//   });
// });
