import { Component } from '@angular/core';
import {db,model} from 'baqend/realtime';


@Component({
  selector: 'chats-list1',
  template: `
<div class="container-fluid">
<div class="row ">

<div class="col-xs-4 bg-info">
<div class="form-group">
  <form #form="ngForm" >
    <div class="form-group">
      <label>Search</label>
    </div>
    <div class="form-group">
      <input type="text" [(ngModel)]="search.name" class="form-control"  name="search" required>
    </div>
    <button class="btn btn-info" type="button" (click)="onSearch()">Search</button>
  </form>
</div>

<div  >
      <div class="member_list" >
        <div *ngFor="let user of users" class="left clearfix" (click)="onSelect(user)" alt="User Avatar" class="img-circle"  >
        
        <div  class = "member_list_li">
        <span class="chat-img pull-left">
                <img  [src]="getImageUrlUser(user)" alt="User Avatar" class="img-circle">
        </span>
          <div class="chat-body clearfix">
            <h3 class="panel-title">{{ user.username }}</h3>
          </div>
         </div>
         
        </div>
      </div>
      
      </div>
      
      </div>
  
  <div class="col-xs-8 ">
    <chats-list [theuser]="selectedUser" [theuserID]="selectedUserID" ></chats-list>
    </div>
    </div>
     </div>
     
     
`,
  styles: [
    `
     .row { margin-top: 20px }
      img { width: 100% }
      .panel { cursor: pointer }
    `
  ]
})
export class ChatsComponent {
  search = {
    name: ''
  };

  selectedUser :model.User; // note to delete
  selectedUserID: String;
  // public messages: Array<model.Message>;
  public users: Array<model.User>;
 // selectedUser: model.User;

  constructor() {}

  getImageUrlUser(user) {
    return user.image.url;
  }

  onSearch(){

    db.User
      .find()
      .equal('username', this.search.name )
      .resultList()
      .then(users => this.users = users);
      console.log(this.users);
  }

  onSelect(user: model.User): void {
    this.selectedUser = user;
    this.selectedUserID = user.key;
  }


  ngOnInit() {
    db.User
      .find()
      .resultList()
      .then(users => this.users = users);
  }

}
