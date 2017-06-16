/**
 * Created by opaluwa john on 6/9/2017.
 */
import {Injectable} from '@angular/core';

@Injectable()
// used by chat component to set the user object in chathistory
export class ChatService {
  public userObject : any;

  public setUserObject(item:any): any{
    this.userObject = item
  }

  public  getUserObject(){
    return Promise.resolve(this.userObject)
  }
}
