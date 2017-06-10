/**
 * Created by opaluwa john on 5/31/2017.
 */
import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
//service for login and logout
export class UserService {
 public LoggedState : any;

  constructor() {
    this.LoggedState = new EventEmitter();
  }

  public setLoggedState(item:any): void {
    this.LoggedState.emit(item);
  }
}
