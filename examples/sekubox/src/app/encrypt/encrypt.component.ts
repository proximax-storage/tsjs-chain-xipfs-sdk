import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { SelectPrivacyType } from '../app.component';
import { PrivacyType, NemPrivacyStrategy } from 'xpx2-ts-js-sdk';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatProgressButtonOptions } from 'mat-progress-buttons';
import { FileInput } from 'ngx-material-file-input';
import { PasswordPrivacyStrategy } from '../../../../../src/lib/privacy/password-privacy';
import { saveAs } from 'file-saver/FileSaver';
import { PrivacyStrategy } from '../../../../../src/lib/privacy/privacy';

@Component({
    selector: 'app-encrypt',
    templateUrl: './encrypt.component.html',
    styleUrls: ['./encrypt.component.css']
})
export class EncryptDecryptComponent implements OnInit {
    encryptForm: FormGroup;
    privacyType = 1000;
    showPassword = false;
    showKey = false;

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
            password: [''],
            dataFile: [''],
            privacyStrategy: [''],
            privateKey: [''],
            publicKey: ['']
        });

        this.encryptForm.get('privacyStrategy').valueChanges.subscribe(
            value => {
                // console.log(value);
                this.privacyType = value;
                if (value === 1004) {
                    this.showPassword = true;
                    this.showKey = false;
                } else if (value === 1005) {
                    this.showKey = true;
                    this.showPassword = false;
                }
            }
        );
    }



    // Click handler
    encrypt() {
        console.log(this.privacyType);
        if (this.encryptForm.valid) {
            this.encryptBtnOpts.active = true;
            const password = this.encryptForm.get('password').value;
            const privateKey = this.encryptForm.get('privateKey').value;
            const publicKey = this.encryptForm.get('publicKey').value;
            const fInputControl = this.encryptForm.get('dataFile');
            const fileInput: FileInput = fInputControl.value;
            if (fileInput) {
                const myFile = fileInput.files[0];
                const reader = new FileReader();
                const encryptedFileName = myFile.name + '.encrypted';
                console.log(privateKey);
                console.log(publicKey);

                reader.onload = () => {
                   /* const encryptor = new PasswordPrivacyStrategy(password);
                    encryptor.encrypt(reader.result).subscribe(encrypted => {
                        console.log(encrypted);
                        this.encryptBtnOpts.active = false;
                        const blob = new Blob([encrypted]);
                        saveAs(blob, encryptedFileName);
                    });*/

                    const encryptor = new NemPrivacyStrategy(privateKey, publicKey);
                    encryptor.encrypt(reader.result).subscribe(encrypted => {
                        console.log(encrypted);
                        this.encryptBtnOpts.active = false;
                        const blob = new Blob([encrypted]);
                        //saveAs(blob, encryptedFileName);
                    });

                };
                reader.readAsArrayBuffer(myFile);


            }
        }
    }






}
