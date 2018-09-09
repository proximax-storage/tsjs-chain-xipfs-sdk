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
  TransactionService,
  DataService,
  IpfsConnection,
  BlockchainNetworkConnection,
  UploadService,
  DataStreamer
} from 'xpx2-js-sdk';
import { environment } from '../../environments/environment';
import { UploadParameter } from 'xpx2-js-sdk/build/main/lib/model/upload/upload-parameter';
import { UploadParameterData } from 'xpx2-js-sdk/build/main/lib/model/upload/upload-parameter-data';
import { FileInput } from 'ngx-material-file-input';
import { map } from 'rxjs/operators';
import { BlobStreamer } from 'src/app/add-content-dialog/BlockStreamer';
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
  file: File;

  privacyTypes: SelectPrivacyType[] = [
    {
      value: PrivacyType.PLAIN,
      viewValue: PrivacyType[PrivacyType.PLAIN]
    }
  ];

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

  async onSubmit(form: NgForm): Promise<void> {
    // this.dialogRef.close();

    const description = this.addContentForm.get('description');
    const title = this.addContentForm.get('title');
   // const contentType = '';
    const signerPrivateKey = 'D35F7C7697CA8CA16A0DE483C891B8591F7DE6B7E46A35AF54DE25882E4B32ED';
    const recipientPublicKey = '9A63C603EA56DC058E9EB2E0DF8C769C19CB859C898F06247769E5DE312CD58F';
    const recipientAddress = 'SBFU4SOEI7WLPXOXP4ULQ5F7UXKG3J6DGMS3ZINI';

    const metadata = new Map<any, any>();

    const fInputControl = this.addContentForm.get('dataFile');
    const fileInput: FileInput = fInputControl.value;
    const myFile = fileInput.files[0];

    const reader = new FileReader();
    reader.onloadend = () => {
      const options = {
        progress: (bytes: number) => {
          console.log(`Progress: ${bytes}/${myFile.size}`);
        }
      };

      const dataParam = new UploadParameterData(
        reader.result,
        null,
        options,
        description.value,
        myFile.type,
        metadata,
        title.value
      );

      const param = new UploadParameter(
        dataParam,
        signerPrivateKey,
        recipientPublicKey,
        recipientAddress,
        null,
        false,
        PrivacyType.PLAIN
      );

      this.uploadService.uploadAsync(param).subscribe(console.log);
      // console.log(data);
      /*this.dataService
        .createProximaxDataFile(
          reader.result,
          myFile.type,
          PrivacyType.PLAIN,
          options
        )
        .subscribe(console.log);*/
    };

    reader.readAsArrayBuffer(myFile);

    this.cd.markForCheck();
  }
}
