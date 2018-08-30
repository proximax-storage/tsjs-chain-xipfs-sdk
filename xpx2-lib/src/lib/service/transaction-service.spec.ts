import 'mocha';
import { NetworkType } from 'nem2-sdk';
import { KeyPair } from '../model/common/keypair';
import { PrivacyStrategyType } from '../model/privacy/privacy-strategy-type';
import { ProximaxDataFile } from '../model/proximax/data-file';
import { ProximaxDataPayload } from '../model/proximax/data-payload';
import { TransactionService } from './transaction-service';

describe('TransactionService', () => {
  it('should announce transaction', async () => {
    const metadata = new Map<any, any>();
    metadata.set('author', 'Proximax');

    const datalist = [];
    datalist.push(
      new ProximaxDataFile(
        'QmSV5y3v9aWhJivY6YEphkt2z69aXRem8nRmVH5s8Xuosw',
        'text/plain',
        PrivacyStrategyType.PLAIN
      )
    );
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
      'http://localhost:3000',
      NetworkType.MIJIN_TEST
    );
    await transactionx
      .createTransaction(payload, keyPair)
      .subscribe(console.log);
  });
});
