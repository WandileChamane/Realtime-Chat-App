import { Component} from '@angular/core';
import { Router } from '@angular/router';
import { db } from 'baqend/realtime';
import {UserService } from '../user.service';

@Component({
  selector: 'signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})

export class SignupComponent {

  user = {
    name: '',
    password: ''
  };

  error;

  //injects router and UserService
  constructor(private router:Router , private logedState: UserService) {

    // on initialization, if user looged in navigate to me component
    if (db.User.me)
      this.router.navigate(['/me']);
  }

  register() {
    var file = new db.File({path: '/Images/blank.png'});
      var user = new db.User({
        'username': this.user.name,
        'image': file,
      });
      db.User.register(user, this.user.password).then(() => {
        db.Role.find().equal('name', 'readTheUsers').singleResult(function(role) {
          var id = db.User.me.id;
          var loadedUser =  db.User.load(id).then(function (todo) {
              role.addUser(db.User.me);
              role.save();
              todo.acl.allowReadAccess(role);
              return todo.save();
          });
        });
        this.logedState.setLoggedState(db.User.me)
        this.router.navigate(['/chatcontainer']);
      }, (error) => {
        this.error = error.message;
      });
  }

  logIn() {
    db.User.login(this.user.name, this.user.password).then(() => {
      this.logedState.setLoggedState(db.User.me)
      this.router.navigate(['/chatcontainer']);
    }, (error) => {
      this.error = error.message;
    });
  }

}
