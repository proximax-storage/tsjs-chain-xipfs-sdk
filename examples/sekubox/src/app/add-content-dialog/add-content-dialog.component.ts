import {
  Component,
  OnInit,
  Inject,
  EventEmitter,
  ChangeDetectorRef
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, NgForm } from '@angular/forms';
import {
  PrivacyType,
  BlockchainNetworkConnection,
  UploadService,
  TransactionClient,
  BlockchainTransactionService,
  ProximaxDataService,
  IpfsClient,
  IpfsConnection,
  UploadParameterData,
  UploadParameter
} from 'xpx2-ts-js-sdk';
import { environment } from '../../environments/environment';

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
  transactionService: BlockchainTransactionService;
  dataService: ProximaxDataService;
  uploadService: UploadService;
  ipfsClient: IpfsClient;
  transactionClient: TransactionClient;
  file: File;


  privacyTypes: SelectPrivacyType[] = [
    {
      value: PrivacyType.PLAIN,
      viewValue: PrivacyType[PrivacyType.PLAIN]
    }
  ];

  progressBuffer = 0;
  showProgress = false;
  submitted = false;
  uploading = true;
  transactionHash = '';
  progressStatus = 'Uploading...';
  public event: EventEmitter<any> = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
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
      environment.blockchainConnection.socketUrl
    );
    this.ipfsClient = new IpfsClient(ipfsConnection);

    this.dataService = new ProximaxDataService(this.ipfsClient);
    this.transactionClient = new TransactionClient(blockchainConnection, WebSocket);
    this.transactionService = new BlockchainTransactionService(blockchainConnection, this.transactionClient);
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

    this.progressBuffer = 0;
  }

  onNoClick(): void {

    this.dialogRef.close(this.transactionHash);
  }

  get f() {
    return this.addContentForm.controls;
  }

  async onSubmit(form: NgForm): Promise<void> {
    // this.dialogRef.close();
    this.showProgress = true;
    this.submitted = true;
    this.uploading = true;
    const description = this.addContentForm.get('description').value;
    const title = this.addContentForm.get('title').value;
    const metadata = this.addContentForm.get('metadata').value;
    let metadataMap = new Map<any, any>();
    if (metadata) {
      try {
        metadataMap = new Map(JSON.parse(metadata));
      } catch {

      }
    }

    const privacyType = this.addContentForm.get('privacyType').value;
    const version = '1.0';

    console.log(title);
    console.log(description);
    console.log(metadataMap);
    console.log(privacyType);

    const dataParam = new UploadParameterData(
      undefined,
      null,
      undefined,
      description,
      undefined,
      metadataMap,
      title
    );


    const fInputControl = this.addContentForm.get('dataFile');
    const fileInput: FileInput = fInputControl.value;
    if (fileInput) {
      const myFile = fileInput.files[0];
      const reader = new FileReader();



      reader.onload = () => {

        const options = {
          progress: (bytes: number) => {
            console.log(`Progress: ${bytes}/${myFile.size}`);
            this.progressBuffer = (bytes / myFile.size) * 100;
            this.progressStatus = `Progress: ${bytes}/${myFile.size}`;

            if (bytes === myFile.size) {
              this.uploading = false;
              this.progressStatus = 'Completed';
            }
          }
        };
        dataParam.options = options;
       // dataParam.contentType = myFile.type;
        dataParam.byteStreams = reader.result;

        const param = new UploadParameter(
          dataParam,
          environment.blockchainConnection.senderTestAccount.privateKey,
          privacyType,
          version,
          environment.blockchainConnection.recipientTestAccount.publicKey,
          environment.blockchainConnection.recipientTestAccount.address,
          1,
          false,
          true
        );
        param.data = dataParam;
        param.validate();
        this.uploadService.upload(param).subscribe(transaction => {
          console.log(transaction.transactionHash);
          this.transactionHash = transaction.transactionHash;
          // this.dialogRef.close(transaction.transactionHash);

        });

      };
      reader.readAsArrayBuffer(myFile);

    }

    this.cd.markForCheck();

  }
}
