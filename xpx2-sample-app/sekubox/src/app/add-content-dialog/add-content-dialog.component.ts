import { Component, OnInit, Inject, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, NgForm } from '@angular/forms';
import {
  PrivacyType,
  TransactionService,
  DataService,
  IpfsConnection,
  BlockchainNetworkConnection,
  UploadService
} from 'xpx2-js-sdk';
import { environment } from '../../environments/environment';
import { UploadParameter } from 'xpx2-js-sdk/build/main/lib/model/upload/upload-parameter';
import { UploadParameterData } from 'xpx2-js-sdk/build/main/lib/model/upload/upload-parameter-data';
import { FileInput } from 'ngx-material-file-input';

export interface SelectPrivacyType {
  value: number;
  viewValue: string;
}

@Component({
  selector: 'app-add-content-dialog',
  templateUrl: './add-content-dialog.component.html',
  styleUrls: ['./add-content-dialog.component.css']
})
export class AddContentDialogComponent implements OnInit {
  addContentForm: FormGroup;
  transactionService: TransactionService;
  dataService: DataService;
  uploadService: UploadService;
  file: any;

  privacyTypes: SelectPrivacyType[] = [
    {
      value: PrivacyType.PLAIN,
      viewValue: PrivacyType[PrivacyType.PLAIN]
    }
  ];

  public event: EventEmitter<any> = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddContentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    const ipfsConnection = new IpfsConnection(
      environment.ipfsConnection.multAddress,
      environment.ipfsConnection.port
    );
    const blockchainConnection = new BlockchainNetworkConnection(
      environment.blockchainConnection.network,
      environment.blockchainConnection.endpointUrl,
      environment.blockchainConnection.gatewayUrl
    );
    this.dataService = new DataService(ipfsConnection);

    this.transactionService = new TransactionService(blockchainConnection);
    this.uploadService = new UploadService(
      this.transactionService,
      this.dataService
    );
  }

  ngOnInit() {
    this.addContentForm = this.fb.group({
      dataFile: [],
      title: [],
      description: [],
      metadata: [],
      privacyType: []
    });
  }

  onNoClick(): void {
    this.dialogRef.close();

  }

  onSubmit(form: NgForm): void {
    this.dialogRef.close();
    /*const byteStream = this.file;
    const description = '';
    const contentType = '';
    const signerPrivateKey = '';
    const recipientPublicKey = '';
    const recipientAddress = '';

    const metadata = new Map<any, any>();
    const dataParam = new UploadParameterData(
      byteStream,
      null,
      null,
      description,
      contentType,
      metadata,
      name
    );

    const param = new UploadParameter(
      dataParam,
      signerPrivateKey,
      recipientPublicKey,
      recipientAddress,
      null,
      false,
      PrivacyType.PLAIN);

    this.uploadService.uploadAsync(param).subscribe(console.log);*/

    const fInput = this.addContentForm.get('dataFile');
    const file: FileInput = fInput.value;
    console.log(file.files[0].type);
  }


}
