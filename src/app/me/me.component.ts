import {Component, OnInit} from '@angular/core';
import {model, db} from 'baqend/realtime';
import {Router, Routes} from "@angular/router";
import {UserService } from '../user.service';



export const routes: Routes = [
  { path: 'chats', loadChildren: '../+chats#ChatsModule'},
]

@Component({
  selector: 'me',
  templateUrl: './me.component.html',
  //providers:[UserService]
})

export class MeComponent implements OnInit {

  me:model.User;

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

      this.router.navigate(['/chats']);

  }
}
