import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { MaterialModule } from './material.module';
import {FlexLayoutModule} from '@angular/flex-layout';

import { AppRouters } from './app.routes';
import { ContentComponent } from './content/content.component';
import { AddContentDialogComponent } from './add-content-dialog/add-content-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConnectionDialogComponent } from './connection-dialog/connection-dialog.component';

@NgModule({
  declarations: [
    AppComponent,

    ContentComponent,
    AddContentDialogComponent,
    ConnectionDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule,
    AppRouters,
    FormsModule,
    ReactiveFormsModule 
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [
    AddContentDialogComponent
  ],
})
export class AppModule { }
