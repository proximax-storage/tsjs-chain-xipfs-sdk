import { NgModule } from '@angular/core';
import { MaterialFileInputModule } from 'ngx-material-file-input';
import {
  MatSidenavModule,
  MatToolbarModule,
  MatIconModule,
  MatListModule,
  MatCardModule,
  MatButtonModule,
  MatTableModule,
  MatDialogModule,
  MatInputModule,
  MatSelectModule,
} from '@angular/material';

@NgModule({
  imports: [
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    MaterialFileInputModule,
    MatDialogModule,
    MatInputModule,
    MatSelectModule
  ],
  exports: [
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    MaterialFileInputModule,
    MatDialogModule,
    MatInputModule,
    MatSelectModule
  ]
})
export class MaterialModule {}
