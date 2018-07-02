import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { UserService } from './user.service';
import { User } from './classes';
import { UserDialogComponent } from './user-dialog/user-dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  user: User;

  constructor(public dialog: MatDialog,
              private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getUser().subscribe((user: User) => {
      if (user) {
        this.user = user;
      } else {
        this.user = null;
      }
    });
  }

  showLoginDialog() {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '21em',
    });

    dialogRef.afterClosed().subscribe((user: User) => {
      this.userService.setUser(user);
    });
  }

  logout() {
    this.userService.setUser(null);
  }

}
