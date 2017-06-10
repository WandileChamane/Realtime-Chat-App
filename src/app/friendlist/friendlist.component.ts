import { Component } from '@angular/core';
import { db , model } from 'baqend/realtime';
import { Router} from '@angular/router';
import  {ChatService} from  '../chat.service'


@Component({
  selector: 'friendlist-list',
  providers:[ChatService],
  templateUrl: `./friendlist.component.html`,
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

export class FriendlistComponent {

  // Injecting Router and ChatService
  constructor(private router:Router, private  userObject: ChatService
  ) {}

  search = {
    name: ''
  };

  notSupportedFile: any
  theLogedUser : any
  modalImageSrc;
  error;
  selectedUser :model.User;
  public users: Array<model.User>;

  //get the user Url
  getImageUrlUser(user) {
    return user.image.url;
  }

  uploadFiles($event) {

    //load the file object from baqend
    var file = new db.File({data: $event.target.files[0], type: 'blob',
      parent:'/Images'
    });

    if(file.mimeType == 'image/png' || file.mimeType ==  'image/jpeg' ){

      //set the file access level
    file.acl.allowReadAccess(db.User.me);
    file.acl.allowWriteAccess(db.User.me);

    /*upload the file, load logged user object from baqend,
      update image file object into the loggedIn User
      image field*/
    file.upload({force: true}).then(picture =>{
      var todo =  db.User.load(db.User.me.id).then(loggedUser=> {
        loggedUser.image = picture
        loggedUser.save().then(res=>{
          //set false if the image file was succesfully uploaded and the image file
          //object is placed in the Logged in User Image field
          this.notSupportedFile = false});
        }
      )
    })

    }
    //set true if the file format is not supported i.e if the file is not of type
      // png or jpeg
    else{
      this.notSupportedFile = true;
    }

  }

  // sets modal Image URL and set notSupported file to false
  setModalImage(user: model.User){
   this.modalImageSrc = this.getImageUrlUser(user);
   this.setnotSupportedFile();
  }

  setnotSupportedFile(){
    this.notSupportedFile = false
  }

  //called in template. Uses the chat service to set the selected user
  onSelect(user: model.User): void {
    this.userObject.setUserObject(user)
    this.selectedUser = user;
  }

  ngOnInit() {

    //checks if the User logged in, then loads list of Users from baqend
    if (db.User.me != null){
    db.User
      .find()
      .resultList()
      .then((users) => {this.users = users;  this.theLogedUser = db.User.me});
    }
    //If user not logged in navigate back to the signup page
    else {
      this.router.navigate(['/signup'], );
      }

  }

}
