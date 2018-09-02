import {
  Account,
  Address,
  Deadline,
  NetworkType,
  PlainMessage,
  Transaction,
  TransactionHttp,
  TransferTransaction
} from 'nem2-sdk';
import { Observable } from 'rxjs';
// import { map } from 'rxjs/operators';
import { KeyPair } from '../model/common/keypair';

export class TransactionService {
  private network: NetworkType = NetworkType.MIJIN_TEST;
  private host: string = 'http://localhost:3000';

  constructor(network: NetworkType, host: string) {
    this.network = network;
    this.host = host;
  }

  public createAsyncTransaction(
    message: any,
    keypair: KeyPair
  ): Observable<any> {
    const senderAccount = Account.createFromPrivateKey(
      keypair.privateKey,
      this.network
    );

    const recipientAddress = Address.createFromPublicKey(
      keypair.publicKey,
      this.network
    );

    const payload = JSON.stringify(message);

    const transferTransaction = TransferTransaction.create(
      Deadline.create(),
      recipientAddress,
      [],
      PlainMessage.create(payload),
      this.network
    );

    const signedTransaction = senderAccount.sign(transferTransaction);

    const transactionHttp = new TransactionHttp(this.host);
    // console.log(signedTransaction);
    // NOTE:  Need to run nem2-camel acted as a proxy
    return transactionHttp.announceSync(signedTransaction);
    /*return transactionHttp.announceSync(signedTransaction).pipe(
      map(response => {
        console.log(signedTransaction);
        return response.transactionInfo ? response.transactionInfo.hash : '';
      })
    );*/
  }

  public getTransaction(transactionHash: string): Observable<Transaction> {
    const transactionHttp = new TransactionHttp(this.host);
    console.log(this.host);
    return transactionHttp.getTransaction(transactionHash);
  }

  public createTransaction(message: any, keypair: KeyPair): Account {
    const senderAccount = Account.createFromPrivateKey(
      keypair.privateKey,
      this.network
    );

    const recipientAddress = Address.createFromPublicKey(
      keypair.publicKey,
      this.network
    );

    const transferTransaction = TransferTransaction.create(
      Deadline.create(),
      recipientAddress,
      [],
      PlainMessage.create(message),
      this.network
    );

    const signedTransaction = senderAccount.sign(transferTransaction);

    const transactionHttp = new TransactionHttp(this.host);

    transactionHttp.announce(signedTransaction);

    return senderAccount;
  }
}
