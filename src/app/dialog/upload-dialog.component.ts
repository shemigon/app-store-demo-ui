import { Component, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { forkJoin } from 'rxjs';
import { FileService } from '../file.service';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';
import { ObservableInput } from 'rxjs/internal/types';
import { of } from 'rxjs/internal/observable/of';

@Component({
  selector: 'app-dialog',
  templateUrl: './upload-dialog.component.html',
  styleUrls: ['./upload-dialog.component.less']
})
export class UploadDialogComponent {
  @ViewChild('file')
  file;
  public files: Set<File> = new Set();

  progress;
  canBeClosed = true;
  primaryButtonText = 'Upload';
  showCancelButton = true;
  uploading = false;
  uploadSuccessful = false;

  constructor(public dialogRef: MatDialogRef<UploadDialogComponent>, public fileService: FileService) {}

  addFiles() {
    this.file.nativeElement.click();
  }

  onFilesAdded() {
    const files: { [key: string]: File } = this.file.nativeElement.files;
    for (const key in files) {
      if (!isNaN(parseInt(key, 10))) {
        this.files.add(files[key]);
      }
    }
  }

  closeDialog() {
    // if everything was uploaded already, just close the dialog
    if (this.uploadSuccessful) {
      return this.dialogRef.close();
    }

    // set the component state to "uploading"
    this.uploading = true;

    // start the upload and save the progress map
    this.progress = this.fileService.uploadFile(this.files);

    // convert the progress map into an array
    const allProgressObservables = [];
    for (const key in this.progress) {
      if (key) {
        allProgressObservables.push(this.progress[key].progress);
      }
    }
    // Adjust the state variables

    // The OK-button should have the text "Finish" now
    this.primaryButtonText = 'Finish';

    // The dialog should not be closed while uploading
    this.canBeClosed = false;
    this.dialogRef.disableClose = true;

    // Hide the cancel-button
    this.showCancelButton = false;

    // When all progress-observables are completed...
    forkJoin(allProgressObservables)
      .pipe(
        catchError(
          (err: any, caught: Observable<any>): ObservableInput<{}> => {
            this.primaryButtonText = 'Close';
            this.canBeClosed = true;
            this.dialogRef.disableClose = false;
            this.uploadSuccessful = false;
            this.uploading = false;
            return of({});
          }
        )
      )
      .subscribe(end => {
        this.fileService.loadFiles();
        // ... the dialog can be closed again...
        this.canBeClosed = true;
        this.dialogRef.disableClose = false;

        // ... the upload was successful...
        this.uploadSuccessful = true;

        // ... and the component is no longer uploading
        this.uploading = false;
      });
  }
}
