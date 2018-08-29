import {
  Account,
  Address,
  Deadline,
  NetworkType,
  PlainMessage,
  TransactionAnnounceResponse,
  TransactionHttp,
  TransferTransaction
} from 'nem2-sdk';
import { Observable } from 'rxjs';
import { KeyPair } from '../model/common/keypair';

export class TransactionService {
  private network: NetworkType = NetworkType.MIJIN_TEST;
  private host: string = 'http://localhost:3000';

  constructor(host: string, network: NetworkType) {
    this.network = network;
    this.host = host;
  }

  public createTransaction(
    message: any,
    keypair: KeyPair
  ): Observable<TransactionAnnounceResponse> {
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

    return transactionHttp.announce(signedTransaction);
  }
}
