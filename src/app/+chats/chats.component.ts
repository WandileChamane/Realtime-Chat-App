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


  notSupportedFile: any
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



  uploadFiles($event) {
   // var pendingUploads = [];
   // var newId = this.id;
   // console.log('this is the name', + $event.target.files[0].name);
    // If you omit the name parameter, the name of the provided file object is used
    var file = new db.File({data: $event.target.files[0], type: 'blob',
      parent:'/Images'
    });

    if(file.mimeType == 'image/png' || file.mimeType ==  'image/jpeg' ){
    file.acl.allowReadAccess(db.User.me);
    file.acl.allowWriteAccess(db.User.me);
    file.upload({force: true}).then(picture =>{


      var todo =  db.User.load(db.User.me.id).then(loggedUser=> {
        loggedUser.image = picture
        loggedUser.save().then(res=>{this.notSupportedFile = false}); //updates the object
        }
      )

    })

    } else{
      this.notSupportedFile = true;
    }

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
    this.setnotSupportedFile();
  }

  setnotSupportedFile(){
    this.notSupportedFile = false
  }

  onSelect(user: model.User): void {
    this.selectedUser = user;
    this.selectedUserID = user.key;
  }

  ngOnInit() {
   // console.log(db.User.me)
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
