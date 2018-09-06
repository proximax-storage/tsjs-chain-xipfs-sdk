import { Component, OnInit, Inject, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-add-content-dialog',
  templateUrl: './add-content-dialog.component.html',
  styleUrls: ['./add-content-dialog.component.css']
})
export class AddContentDialogComponent implements OnInit {

  xpxData = {
    title: '',
    description: '',
    metadata: '',
    dataFile: [],

  };

  public event: EventEmitter<any> = new EventEmitter();

  constructor(
    public dialogRef: MatDialogRef<AddContentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {

    this.dialogRef.close();
  }
}
