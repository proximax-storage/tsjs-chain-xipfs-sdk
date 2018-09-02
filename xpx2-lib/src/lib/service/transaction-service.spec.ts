import 'mocha';
import {
  Account,
  Address,
  Deadline,
  NetworkType,
  PlainMessage,
  TransactionHttp,
  TransferTransaction
} from 'nem2-sdk';
// import { KeyPair, PrivacyStrategyType, TransactionService } from '../..';
// import { ProximaxDataFile } from '../model/proximax/data-file';
// import { ProximaxDataPayload } from '../model/proximax/data-payload';

describe('TransactionService', () => {
  it('should announce transaction', () => {
    /* const metadata = new Map<any, any>();
    metadata.set('author', 'Proximax');

    const datalist: ProximaxDataFile[] = [];
    const df = new ProximaxDataFile(
      'QmSV5y3v9aWhJivY6YEphkt2z69aXRem8nRmVH5s8Xuosw',
      'text/plain',
      PrivacyStrategyType.PLAIN
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
        'B14B4727479681A4673593EF795E490DB70CEF68D38A54D1E523261ECF89CCCE',
      publicKey:
        'F6F6BD6A1AAFBD48D488E24C3B6557512AE711CCB266D44804E131B04CB96B52'
    };

    const transactionx = new TransactionService(
      NetworkType.MIJIN_TEST,
      'http://172.24.231.94:9000'
    );

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
    );*/
    const senderAccount = Account.createFromPrivateKey(
      'EE61A8752DFAD35CE520D72CAAA36B83014434C4AB1E08E8F3DD4760C58DC34C',
      NetworkType.MIJIN_TEST
    );

    const recipientAddress = Address.createFromPublicKey(
      '88957079996C1940ADEE63A9E964F4BDA4CD45551EEEE2E62B54075D236C44D7',
      NetworkType.MIJIN_TEST
    );

    // const payload = JSON.stringify(message);

    const transferTransaction = TransferTransaction.create(
      Deadline.create(),
      recipientAddress,
      [],
      PlainMessage.create('Hi'),
      NetworkType.MIJIN_TEST
    );

    const signedTransaction = senderAccount.sign(transferTransaction);

    const transactionHttp = new TransactionHttp('http://172.24.231.94:9000');

    transactionHttp.announceSync(signedTransaction).subscribe(
      response => {
        console.log(response);
      },
      error => {
        console.log('Error ...');
        console.log(error);
      },
      () => {
        console.log('done');
      }
    );
  });
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
