import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AddContentDialogComponent } from '../add-content-dialog/add-content-dialog.component';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AddContentDialogComponent, {
      width: '600px',
      data: 'Add Content'
    });
  }
}
