import { Component, OnInit, Inject, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';
import { PrivacyType } from 'xpx2-js-sdk';
@Component({
  selector: 'app-add-content-dialog',
  templateUrl: './add-content-dialog.component.html',
  styleUrls: ['./add-content-dialog.component.css']
})
export class AddContentDialogComponent implements OnInit {


  addContentForm: FormGroup;
  privacyTypes = PrivacyType;

  public event: EventEmitter<any> = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddContentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.addContentForm = this.fb.group({
      dataFile: [],
      title: [],
      description: [],
      metadata: [],
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {

    this.dialogRef.close();
  }

}
