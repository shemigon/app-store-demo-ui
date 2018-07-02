import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { FileListComponent } from './file-list/file-list.component';
import {
  MatButtonModule,
  MatDialogModule,
  MatInputModule,
  MatListModule,
  MatProgressBarModule, MatSnackBarModule, MatTableModule, MatToolbarModule
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { UserDialogComponent } from './user-dialog/user-dialog.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from "@angular/flex-layout";
import { UploadDialogComponent } from "./dialog/upload-dialog.component";
import { UploadComponent } from "./upload/upload.component";
import { ErrorHandler, FileService, RequestInterceptor } from "./file.service";
import { FileSizePipe } from "./file-size.pipe";

@NgModule({
  declarations: [
    AppComponent,
    FileListComponent,
    UserDialogComponent,
    UploadComponent,
    UploadDialogComponent,

    FileSizePipe,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,

    FormsModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    MatListModule,
    FlexLayoutModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatTableModule,
  ],
  providers: [
    FileService,
    ErrorHandler,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RequestInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    UserDialogComponent,
    UploadDialogComponent,
  ],
})
export class AppModule {}
