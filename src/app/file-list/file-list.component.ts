import { Component, OnInit } from '@angular/core';
import { FileService } from '../file.service';
import { User, UserFile } from '../classes';
import { UserService } from "../user.service";

@Component({
  selector: 'app-file-list',
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.less']
})
export class FileListComponent implements OnInit {
  public files: UserFile[];
  public user: User;

  public displayedColumns = ['id', 'name', 'size', 'commands'];

  constructor(
    private fileService: FileService,
    private userService: UserService,
  ) {}

  ngOnInit() {
    this.fileService.fileList.subscribe((files) => {
      this.files = files;
    });
    this.userService.getUser().subscribe((user) => {
      this.user = user;
    })
  }

  deleteFile(file: UserFile): void {
    this.fileService.deleteFile(file);
  }

  download(file: UserFile): void {
    this.fileService.downloadFile(file);
  }

}
