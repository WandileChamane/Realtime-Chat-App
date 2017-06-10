/**
 * Created by opaluwa john on 5/31/2017.
 */
import { Injectable, EventEmitter } from '@angular/core';
import {Observable} from 'rxjs/Rx';
import { db , model } from 'baqend/realtime';



@Injectable()
export class UserService {
 public LoggedState : any;
 //public LoggedIn : any
  //array:any
 

  constructor() {
   // this.LoggedOut = new EventEmitter();
    this.LoggedState = new EventEmitter();
  }



  public setLoggedState(item:any): void {
    this.LoggedState.emit(item);
  }

 /* public LoggedInState(item: model.User): void {
    this.LoggedIn.emit(item);
  }
*/

  /*subisloggedIn(): Observable<any> {
   // this.LoggedIn = value;
    //return this.array
    return this.LoggedIn
  }*/

  /*setisloggedIn(value: boolean) {
    this.LoggedIn = value;
    //return this.array
    //return this.LoggedIn
  }*/


}
