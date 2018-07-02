import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User, UserFile } from './classes';
import { UserService } from './user.service';
import {
  HttpClient,
  HttpErrorResponse,
  HttpEvent,
  HttpEventType,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from "@angular/common/http";
import { MatSnackBar } from "@angular/material";
import { tap } from "rxjs/operators";
import { Subject } from "rxjs/internal/Subject";
import { environment } from "../environments/environment";


interface BaseResponse {
  status: string;
}

interface FileListResponse extends BaseResponse {
  items: UserFile[];
}

interface ErrorResponse extends BaseResponse {
  content: any;
}

@Injectable()
export class ErrorHandler {

  constructor(
    public snackbar: MatSnackBar,
  ) {}

  public handleError(err: any) {
    this.snackbar.open(err.message, 'close');
  }
}

@Injectable()
export class RequestInterceptor implements HttpInterceptor {

  constructor(
    public errorHandler: ErrorHandler,
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(request).pipe(
      tap((event: HttpEvent<any>) => {}, (err: any) => {
        if (err instanceof HttpErrorResponse) {
          this.errorHandler.handleError(err);
        }
      })
    );
  }
}

@Injectable()
export class FileService {
  private url = environment.apiUrl;

  public fileList: BehaviorSubject<UserFile[]> = new BehaviorSubject<UserFile[]>([]);

  protected user: User;

  constructor(
    private userService: UserService,
    private http: HttpClient
  ) {
    userService.getUser().subscribe((user) => {
      this.user = user;
      if (user) {
        this.loadFiles();
      } else {
        this.fileList.next([]);
      }
    });
  }

  public loadFiles() {
    this.http.get<FileListResponse>(this.url, this.reqOptions())
      .subscribe((data: FileListResponse) => {
        this.fileList.next(data.items);
      });
  }

  protected reqOptions(headers: {} = {}, options: {} = {}): {} {
    if (this.user) {
      headers['Authorization'] = this.user.uid;
    }
    options['headers'] = new HttpHeaders(headers);
    return options;
  }

  deleteFile(file: UserFile): void {
    if (this.user) {
      this.http.delete(
        this.url + '/' + file.id,
        this.reqOptions()
      )
        .subscribe(() => {
          this.loadFiles();
        })
    }
  }

  public uploadFile(files: Set<File>): { [key: string]: Observable<number> } {
    // this will be the our resulting map
    const status = {};

    files.forEach(file => {
      // create a new multipart-form for every file
      const formData: FormData = new FormData();
      formData.append('file', file, file.name);

      // create a http-post request and pass the form
      // tell it to report the upload progress
      const req = new HttpRequest('POST', this.url, formData,
        this.reqOptions({}, {reportProgress: true}));

      // create a new progress-subject for every file
      const progress = new Subject<number>();

      // send the http-request and subscribe for progress-updates
      this.http.request(req).subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {

          // calculate the progress percentage
          const percentDone = Math.round(100 * event.loaded / event.total);

          // pass the percentage into the progress-stream
          progress.next(percentDone);
        } else if (event instanceof HttpResponse) {

          // Close the progress-stream if we get an answer form the API
          // The upload is complete
          progress.complete();
        }
      });

      // Save every progress-observable in a map of all observables
      status[file.name] = {
        progress: progress.asObservable()
      };
    });

    // return the map of progress.observables
    return status;
  }

  downloadFile(file: UserFile) {
    if (this.user) {
      this.http
        .get(this.url + '/' + file.id, this.reqOptions({
          'content-type': file.type,
        }, {
          responseType: 'blob',
        }))
        .subscribe(data => {
          let url = window.URL.createObjectURL(data);
          let a = document.createElement('a');
          document.body.appendChild(a);
          a.setAttribute('style', 'display: none');
          a.href = url;
          a.download = file.name;
          a.click();
          window.URL.revokeObjectURL(url);
          a.remove(); // remove the element
        }, error => {
          console.log('download error:', JSON.stringify(error));
        });
    }
  }
}
