import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from './classes';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private user: BehaviorSubject<User> = new BehaviorSubject<User>(new User('123324343'));

  constructor() {}

  getUser(): Observable<User> {
    return this.user;
  }

  setUser(user: User): void {
    this.user.next(user);
  }

}
