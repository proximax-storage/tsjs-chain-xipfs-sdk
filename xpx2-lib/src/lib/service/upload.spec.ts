/*import 'mocha';
import { BlockchainNetworkConnection } from '../connection/blockchain-network-connection';
import { IpfsConnection } from '../connection/ipfs-connection';
import { BlockchainNetworkType } from '../model/blockchain/blockchain-network-type';
import { PrivacyType } from '../model/privacy/privacy-type';
import { UploadParameter } from '../model/upload/upload-parameter';
import { UploadParameterData } from '../model/upload/upload-parameter-data';
import { DataService } from './data-service';

describe('UploadService', () => {
  it('should announce transaction', async () => {
    // prepare
    const Buffer = require('buffer').Buffer;

    const dataContent = Buffer.from('Proximax P2P storage ' + Date.now);
    const description = 'Test upload and announce transaction';
    const contentType = 'text/plain';
    const name = 'readme.txt';
    const metadata = new Map<any, any>();
    metadata.set('Author', 'Proximax');
    const signerPrivateKey =
      'A35F657F4B5437EC9C533C43B0518F515A06A453512E6F1D727E3D40E644712D';
    const recipientPublicKey =
      '9269822AD737DCDFE385881DFE4DA72F20D86E805562F5AC3DB0BEE69789F44D';

    const uploadData: UploadParameterData = new UploadParameterData(
      dataContent,
      undefined,
      undefined,
      description,
      contentType,
      metadata,
      name
    );

    const uploadParam: UploadParameter = new UploadParameter(
      uploadData,
      signerPrivateKey,
      recipientPublicKey,
      undefined,
      undefined,
      false,
      PrivacyType.PLAIN
    );

    const blockchainConnection = new BlockchainNetworkConnection(
      BlockchainNetworkType.MIJIN_TEST,
      'http://172.24.231.82:3000',
      'http://172.24.231.82:9000'
    );
    const ipfsConnection = new IpfsConnection('172.24.231.82', '5001');
    const transactionService = new TransactionService(blockchainConnection);
    const dataService = new DataService(ipfsConnection);
    const uploadService: UploadService = new UploadService(
      transactionService,
      dataService
    );
    await uploadService.uploadAsync(uploadParam).subscribe(
      response => {
        console.log(response);
      },
      error => {
        console.log('Error');
        console.log(error);
      },
      () => {
        console.log('Completed');
      }
    );
  });
});
*/