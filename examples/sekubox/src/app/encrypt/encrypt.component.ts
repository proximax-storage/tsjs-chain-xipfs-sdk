import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { SelectPrivacyType } from '../app.component';
import { PrivacyType } from 'xpx2-ts-js-sdk';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatProgressButtonOptions } from 'mat-progress-buttons';
import { FileInput } from 'ngx-material-file-input';
import { PasswordPrivacyStrategy } from '../../../../../src/lib/privacy/password-privacy';
import { saveAs } from 'file-saver/FileSaver';

@Component({
  selector: 'app-encrypt',
  templateUrl: './encrypt.component.html',
  styleUrls: ['./encrypt.component.css']
})
export class EncryptDecryptComponent implements OnInit {
  encryptForm: FormGroup;


  encryptBtnOpts: MatProgressButtonOptions = {
    active: false,
    text: 'Encrypt',
    spinnerSize: 19,
    raised: true,
    stroked: true,
    buttonColor: 'primary',
    spinnerColor: 'accent',
    fullWidth: false,
    disabled: false,
    mode: 'indeterminate',
  };





  constructor(private fb: FormBuilder,
    private cd: ChangeDetectorRef, ) { }

  ngOnInit() {
    this.encryptForm = this.fb.group({
      password: [],
      dataFile: []
    });


  }

  // Click handler
  encrypt() {
    if (this.encryptForm.valid) {
      this.encryptBtnOpts.active = true;
      const password = this.encryptForm.get('password').value;
      const fInputControl = this.encryptForm.get('dataFile');
      const fileInput: FileInput = fInputControl.value;
      if (fileInput) {
        const myFile = fileInput.files[0];
        const reader = new FileReader();
        const encryptedFileName = myFile.name + '.encrypted';

        reader.onload = () => {
          const privacyStrategy = new PasswordPrivacyStrategy(password);
          privacyStrategy.encrypt(reader.result).subscribe(encrypted => {
            console.log(encrypted);
            this.encryptBtnOpts.active = false;
            const blob = new Blob([encrypted]);
            saveAs(blob, encryptedFileName);
          });
        };

        reader.readAsArrayBuffer(myFile);
      }
    }
  }



}
