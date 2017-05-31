import { Component } from '@angular/core';
import { db , model } from 'baqend/realtime';
import { Router} from '@angular/router';


@Component({
  selector: 'chats-list1',
  templateUrl: `./chats.component.html`,
  styles: [
    `
     .row { margin-top: 20px }
      img { width: 100% }
      .panel { cursor: pointer }
      .selected {
     background: #428bca !important;
      }
    `],
})
export class ChatsComponent {

  constructor(private router:Router
  ) {}

  search = {
    name: ''
  };


  theLogedUser : any
  theUSeredNotLoggedIn;
  modalImageSrc;
  error;
  selectedUser :model.User; // note to delete
  selectedUserID: String;
  public users: Array<model.User>;
 // selectedUser: model.User;

  getImageUrlUser(user) {
    return user.image.url;
  }

 /* onSearch() {

    var queryBuilder =  db.User.find();

    queryBuilder
      .matches('username', new RegExp('^.*'+ this.search.name+'.*'))
      .resultList()
      .then((users) => this.users = users);
  }
*/
  setModalImage(user: model.User){
    //var modalImage = document.getElementById("modal-image");
   this.modalImageSrc = this.getImageUrlUser(user);
  }

  onSelect(user: model.User): void {
    this.selectedUser = user;
    this.selectedUserID = user.key;
  }

  ngOnInit() {
    if (db.User.me != null){
    db.User
      .find()
      .resultList()
      .then((users) => {this.users = users;  this.theLogedUser = db.User.me});
    if(this.theUSeredNotLoggedIn == true)
      this.theUSeredNotLoggedIn ==false;
    } else {
      this.theUSeredNotLoggedIn = true;
      this.router.navigate(['/signup'],  { queryParams: { notLoggedIn: this.theUSeredNotLoggedIn } });
      }
  }
}
