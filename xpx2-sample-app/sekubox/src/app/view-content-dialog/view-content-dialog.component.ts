import { Component, OnInit, ChangeDetectorRef, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {
  BlockchainTransactionService, ProximaxDataService, IpfsClient,
  TransactionClient, DownloadService, DownloadParameter,
  PrivacyType,
  BlockchainNetworkConnection,
  IpfsConnection
} from 'xpx2-js-sdk';
import { environment } from '../../environments/environment';
import { saveAs } from 'file-saver/FileSaver';



@Component({
  selector: 'app-view-content-dialog',
  templateUrl: './view-content-dialog.component.html',
  styleUrls: ['./view-content-dialog.component.css']
})
export class ViewContentDialogComponent implements OnInit {

  transactionService: BlockchainTransactionService;
  dataService: ProximaxDataService;
  downloadService: DownloadService;
  ipfsClient: IpfsClient;
  transactionClient: TransactionClient;
  fileUrl: any;
  fileName: string;
  downloading = true;
  showProgress = true;
  constructor(
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    public dialogRef: MatDialogRef<ViewContentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }



  ngOnInit() {
    this.downloading = true;
    this.showProgress = true;
    const transactionHash = this.data;
    console.log(transactionHash);
    const ipfsConnection = new IpfsConnection(
      environment.ipfsConnection.multAddress,
      environment.ipfsConnection.port
    );
    const blockchainConnection = new BlockchainNetworkConnection(
      environment.blockchainConnection.network,
      environment.blockchainConnection.endpointUrl,
      environment.blockchainConnection.gatewayUrl
    );
    this.ipfsClient = new IpfsClient(ipfsConnection);

    this.dataService = new ProximaxDataService(this.ipfsClient);
    this.transactionClient = new TransactionClient(blockchainConnection);
    this.transactionService = new BlockchainTransactionService(blockchainConnection, this.transactionClient);
    this.downloadService = new DownloadService(this.transactionService, this.dataService);
    const downloadParam = new DownloadParameter(transactionHash,
      environment.blockchainConnection.recipientTestAccount.privateKey,
      PrivacyType.PLAIN,
      false);

    this.downloadService.download(downloadParam).subscribe(
      result => {
        console.log(result);
        const blob = new Blob([result.data.bytes], { type: result.data.contentType });
        this.fileUrl = window.URL.createObjectURL(blob);
        saveAs(blob, result.data.name);
        this.downloading = false;
        this.showProgress = false;
      }
    );

  }

  onNoClick(): void {

    this.dialogRef.close();
  }

}
