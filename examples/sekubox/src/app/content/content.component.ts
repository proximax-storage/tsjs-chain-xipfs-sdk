import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AddContentDialogComponent } from '../add-content-dialog/add-content-dialog.component';
import { ViewContentDialogComponent } from '../view-content-dialog/view-content-dialog.component';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {
  transactions: string[];
  constructor(public dialog: MatDialog) { }

  ngOnInit() {
    this.transactions = [];
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AddContentDialogComponent, {
      width: '600px',
      data: 'Add Content'
    });

    dialogRef.afterClosed().subscribe(hash => {
      console.log('Get has ' + hash);
      if (hash.length > 0) {
        this.transactions.push(hash);
      }

    });
  }

  viewTransaction(transactionHash): void {
    const dialogRef = this.dialog.open(ViewContentDialogComponent, {
      width: '800px',
      data: transactionHash
    });
  }
}
