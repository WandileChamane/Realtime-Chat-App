import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { db } from 'baqend/realtime';

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

  constructor(private router:Router) {
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
        this.router.navigate(['/me']);
      }, (error) => {
        this.error = error.message;
      });
  }

  logIn() {
    db.User.login(this.user.name, this.user.password).then(() => {
      this.router.navigate(['/me']);
    }, (error) => {
      this.error = error.message;
    });
  }

}
