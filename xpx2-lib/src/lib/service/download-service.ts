

import { TransferTransaction } from "nem2-sdk";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { DownloadParameter } from "../model/download/download-parameter";
import { DownloadResult } from "../model/download/download-result";
import { ProximaxMessagePayloadModel } from "../model/proximax/message-payload";
import { BlockchainTransactionService } from "./blockchain-transaction-service";
import { ProximaxDataService } from "./proximax-data-service";

export class DownloadService {
  private blockchainTransactionService: BlockchainTransactionService;
  private proximaxDataService: ProximaxDataService;

  constructor(
    blockchainTransactionService: BlockchainTransactionService,
    proximaxDataService: ProximaxDataService
  ) {
    this.blockchainTransactionService = blockchainTransactionService;
    this.proximaxDataService = proximaxDataService;
  }
/*
  public download(param: DownloadParameter): Observable<DownloadResult> {
    return this.blockchainTransactionService.getTransferTransaction(param.transactionHash).pipe(
     //   map(transferTransaction => this.getMessagePayload(transferTransaction, param.accountPrivateKey)),
        //map(messagePayload => this.createDownloadResult(messagePayload,))

    );
  }*/

  private getMessagePayload(transferTransaction: TransferTransaction,accountPrivateKey:string): ProximaxMessagePayloadModel {
    
    // TODO: handle secure message
    console.log(accountPrivateKey);
    const payload = transferTransaction.message.payload;
    const messagePayloadModel: ProximaxMessagePayloadModel = JSON.parse(payload);

    return messagePayloadModel;
  }
}
