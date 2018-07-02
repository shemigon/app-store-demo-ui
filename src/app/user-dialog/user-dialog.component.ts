import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { User } from '../classes';

@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.less']
})
export class UserDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<UserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onLoginClick(uid: string): void {
    this.dialogRef.close(new User(uid));
  }

  onSignUpClick(): void {
    this.dialogRef.close(new User(makeid(10)));
  }
}

function makeid(n: number): string {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < n; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
