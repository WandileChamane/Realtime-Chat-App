import {Component, OnInit} from '@angular/core';
import {model, db} from 'baqend/realtime';
import {Router} from "@angular/router";
import {UserService } from '../user.service';


@Component({
  selector: 'me',
  templateUrl: './me.component.html',
})


export class MeComponent implements OnInit {

  me:model.User;

  //injects router and UserService
  constructor(private router:Router , private logedState: UserService) {}

  ngOnInit() {
    this.me = db.User.me;
  }

  logout() {
    db.User.logout().then(() => {
      this.router.navigate(['/signup']);
      this.logedState.setLoggedState(null)
    })
  }

  toChatComponent() {
      this.router.navigate(['/chatcontainer']);
  }
}
