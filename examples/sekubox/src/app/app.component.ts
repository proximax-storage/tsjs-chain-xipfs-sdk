import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ConnectionDialogComponent } from './connection-dialog/connection-dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'sekubox';

  constructor(public dialog: MatDialog) {

  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ConnectionDialogComponent, {
      width: '600px',
      data: 'Connection Info'
    });
  }
}

export interface SelectPrivacyType {
  value: number;
  viewValue: string;
}
