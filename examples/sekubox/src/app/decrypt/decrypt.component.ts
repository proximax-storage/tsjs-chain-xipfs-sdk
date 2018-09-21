import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatProgressButtonOptions } from 'mat-progress-buttons';
import { FileInput } from 'ngx-material-file-input';
import { PasswordPrivacyStrategy } from '../../../../../src/lib/privacy/password-privacy';
import { saveAs } from 'file-saver/FileSaver';
@Component({
  selector: 'app-decrypt',
  templateUrl: './decrypt.component.html',
  styleUrls: ['./decrypt.component.css']
})
export class DecryptComponent implements OnInit {


  decryptForm: FormGroup;


  decryptBtnOpts: MatProgressButtonOptions = {
    active: false,
    text: 'Decrypt',
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


    this.decryptForm = this.fb.group({
      decryptPassword: [],
      encryptedDataFile: [],
    });
  }



  decrypt() {
    if (this.decryptForm.valid) {
      this.decryptBtnOpts.active = true;
      const password = this.decryptForm.get('decryptPassword').value;
      const fInputControl = this.decryptForm.get('encryptedDataFile');
      const fileInput: FileInput = fInputControl.value;
      if (fileInput) {
        const myFile = fileInput.files[0];
        const reader = new FileReader();
        const decryptFileName = myFile.name.replace('.encrypted', '');

        reader.onload = () => {
          const privacyStrategy = new PasswordPrivacyStrategy(password);
          privacyStrategy.decrypt(reader.result).subscribe(decrypted => {
            console.log(decrypted);
            this.decryptBtnOpts.active = false;
            const blob = new Blob([decrypted]);
            saveAs(blob, decryptFileName);
          }, error => {
            console.log('Err' + error);
          });
        };

        reader.readAsArrayBuffer(myFile);
      }
    }
  }


}
