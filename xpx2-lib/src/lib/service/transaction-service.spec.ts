import 'mocha';
/*import { KeyPair, PrivacyType, TransactionService } from '../..';
import { BlockchainNetworkConnection } from '../connection/blockchain-network-connection';
import { BlockchainNetworkType } from '../model/proximax/blockchain-network-type';
import { ProximaxDataFile } from '../model/proximax/data-file';
import { ProximaxDataPayload } from '../model/proximax/data-payload';*/

describe('TransactionService', () => {
  /* it('should announce transaction', () => {
    const metadata = new Map<any, any>();
    metadata.set('author', 'Proximax');

    const datalist: ProximaxDataFile[] = [];
    const df = new ProximaxDataFile(
      'QmSV5y3v9aWhJivY6YEphkt2z69aXRem8nRmVH5s8Xuosw',
      'text/plain',
      PrivacyType.PLAIN
    );
    datalist.push(df);
    const payload = new ProximaxDataPayload(
      'Testing 1',
      'Test dsc',
      '',
      metadata,
      datalist
    );

    const keyPair: KeyPair = {
      privateKey:
        '3695D0672A00EC512522DABE98E77E3B135C172F69C06970D1BC3A71F75AC3E6',
      publicKey:
        '98F8B65880E569D823841DDAD19513578A36693708FC6DC2598214D5522A4FD3'
    };
    const blockchainConnection = new BlockchainNetworkConnection(
      BlockchainNetworkType.MIJIN_TEST,
      'http://172.24.231.94:3000',
      'http://172.24.231.94:8000'
    );

    const transactionx = new TransactionService(blockchainConnection);

    transactionx.createAsyncTransaction(payload, keyPair).subscribe(
      response => {
        console.log(response);
      },
      error => {
        console.log(error);
      },
      () => {
        console.log('done');
      }
    );
  });*/
  /*
  it('should get the transaction info', async () => {
   const transactionx = new TransactionService(
      NetworkType.MIJIN_TEST,
      'http://172.24.231.94:9000'
    );

    const transactionHttp = new TransactionHttp('http://172.24.231.94:9000');
    transactionHttp
      .getTransaction(
        '459E0C1F37C903A561DAED6344A195CEE69634E924910808D1F8FF77F5BC583D'
      )
      .subscribe(
        response => {
          console.log(response);
        },
        error => {
          console.log(error);
        },
        () => {
          console.log('done');
        }
      );
      await transactionx
      .getTransaction(
        'EBD1B54F4D9914372044D5B80D04C9C064834990DEE60E1AF8BF9B3FC5C0F168'
      )
      .subscribe(
        response => {
          console.log(response);
        },
        error => {
          console.log(error);
        },
        () => {
          console.log('done');
        }
      );
  });*/
});
