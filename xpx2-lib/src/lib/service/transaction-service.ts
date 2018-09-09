import {
  Account,
  Address,
  Deadline,
  NetworkType,
  PlainMessage,
  SignedTransaction,
  TransactionHttp,
  TransferTransaction
} from 'nem2-sdk';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BlockchainNetworkConnection } from '../connection/blockchain-network-connection';
import { BlockchainNetworkType } from '../model/blockchain/blockchain-network-type';
import { SecureMessage } from '../model/privacy/secure-message';

export class TransactionService {
  private network: NetworkType = NetworkType.MIJIN_TEST;
  private host: string = 'http://localhost:3000';
  private gateway: string = 'http://localhost:9000';

  constructor(blockchainNetwork: BlockchainNetworkConnection) {
    this.network = this.getNemNetworkType(blockchainNetwork.network);
    this.host = blockchainNetwork.endpointUrl;
    this.gateway = blockchainNetwork.gatewayUrl
      ? blockchainNetwork.gatewayUrl
      : blockchainNetwork.endpointUrl;
  }

  public getAddressFromPrivateKey(privateKey: string): string {
    const account = Account.createFromPrivateKey(privateKey, this.network);

    return account.address.plain();
  }

  public announceAsyncTransaction(
    payload: any,
    senderPrivateKey: string,
    recipientPublicKey: string,
    useBlockChainSecureMessage: boolean,
    transactionDeadline?: number
  ): Observable<any> {
    // this.network = NetworkType.MIJIN_TEST;
    // this.gateway = 'http://172.24.231.82:3000';
    const senderAccount = Account.createFromPrivateKey(
      senderPrivateKey,
      this.network
    );

    const recipientAddress = Address.createFromPublicKey(
      recipientPublicKey,
      this.network
    );

    payload = JSON.stringify(payload);

    let message = PlainMessage.create(payload);

    if (useBlockChainSecureMessage) {
      message = SecureMessage.create(payload);
    }

    const transferTransaction = TransferTransaction.create(
      Deadline.create(transactionDeadline),
      recipientAddress,
      [],
      message,
      this.network
    );

    console.log(transferTransaction);

    const signedTransaction = senderAccount.sign(transferTransaction);

    console.log(signedTransaction);

    const transactionHttp = new TransactionHttp(this.gateway);
    console.log(this.gateway);
    // console.log(signedTransaction);
    // NOTE:  Need to run nem2-camel acted as a proxy
    return transactionHttp.announceSync(signedTransaction).pipe(
      map(response => {
        console.log(response);
        return response.transactionInfo!.hash;
      })
    );
  }

  public announcTransaction(signTransaction: SignedTransaction): void {
    const transactionHttp = new TransactionHttp(this.host); 
    transactionHttp.announce(signTransaction);
  }

  /*
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
    );
  }*/
  /*
  public getTransaction(transactionHash: string): Observable<Transaction> {
    const transactionHttp = new TransactionHttp(this.host);
    console.log(this.host);
    return transactionHttp.getTransaction(transactionHash);
  }
  */
  /*
  public createTransaction(
    message: any,
    keypair: KeyPair
  ): Observable<Transaction> {
    return from(this.createAsyncTransaction(message, keypair));
  }*/
  /*
  public createTransactionInternal(message: any, keypair: KeyPair) {
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
      PlainMessage.create(JSON.stringify(message)),
      this.network
    );

    const signedTransaction = senderAccount.sign(transferTransaction);

    const transactionHttp = new TransactionHttp(this.host);

    const listener = new Listener('ws://172.24.231.94:3000');

    listener.open().then(() => {
      return listener.confirmed(senderAccount.address);
    });

    transactionHttp.announce(signedTransaction);
  }
*/
  private getNemNetworkType(
    blockchainNetworkType: BlockchainNetworkType
  ): NetworkType {
    switch (blockchainNetworkType) {
      case BlockchainNetworkType.TEST_NET:
        return NetworkType.TEST_NET;
      case BlockchainNetworkType.MIJIN_TEST:
        return NetworkType.MIJIN_TEST;
      case BlockchainNetworkType.MAIN_NET:
        return NetworkType.MAIN_NET;
      case BlockchainNetworkType.MIJIN_MAIN:
        return NetworkType.MIJIN;
      default:
        return NetworkType.MIJIN_TEST;
    }
  }
}
