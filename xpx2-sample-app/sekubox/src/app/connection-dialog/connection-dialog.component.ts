import { Component, OnInit, Inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder } from '@angular/forms';
import { BlockchainNetworkConnection } from 'xpx2-js-sdk';

@Component({
  selector: 'app-connection-dialog',
  templateUrl: './connection-dialog.component.html',
  styleUrls: ['./connection-dialog.component.css']
})
export class ConnectionDialogComponent implements OnInit {

  storageInfo = {
    hostOrMultiAddress: environment.ipfsConnection.multAddress,
    port: environment.ipfsConnection.port
  };

  blockchainInfo = {
    endpointUrl : environment.blockchainConnection.endpointUrl,
    websocket: environment.blockchainConnection.socketUrl,
    senderPrivateKey: environment.blockchainConnection.recipientTestAccount.privateKey,
    recipientPublicKey: environment.blockchainConnection.recipientTestAccount.publicKey,
    recipientAddress : environment.blockchainConnection.recipientTestAccount.address
  };


  constructor(private fb: FormBuilder,
    public dialogRef: MatDialogRef<ConnectionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {

  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
