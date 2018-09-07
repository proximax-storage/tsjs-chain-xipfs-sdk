import { Component, OnInit, Inject } from '@angular/core';
import { BlockchainNetworkConnection, IpfsNetworkInfo } from 'xpx2-js-sdk';
import { environment } from '../../environments/environment';
import { NetworkInfo, IpfsConnection } from 'xpx2-js-sdk';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-connection-dialog',
  templateUrl: './connection-dialog.component.html',
  styleUrls: ['./connection-dialog.component.css']
})
export class ConnectionDialogComponent implements OnInit {
  blockchain: NetworkInfo = {
    networkType: '',
    baseUrl: '',
    gatewayUrl: '',
    status: 'Disconnected'
  };

  storage: IpfsNetworkInfo = {
    network: '',
    port: '',
    options: {},
    repo: '',
    version: '',
    status: 'Disconnected'
  };

  constructor(private fb: FormBuilder,
    public dialogRef: MatDialogRef<ConnectionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {
    const bcConnector = new BlockchainNetworkConnection(
      environment.blockchainConnection.network,
      environment.blockchainConnection.endpointUrl,
      environment.blockchainConnection.gatewayUrl
    );

    const storageConnector = new IpfsConnection(
      environment.ipfsConnection.multAddress,
      environment.ipfsConnection.port
    );

    bcConnector.isConnect().subscribe(blockchain => {
      this.blockchain = blockchain;
    });

    storageConnector.isConnect().subscribe(storage => {
      this.storage = storage;
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
