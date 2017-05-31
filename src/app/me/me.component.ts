import {Component, OnInit} from '@angular/core';
import {model, db} from 'baqend/realtime';
import {Router, Routes} from "@angular/router";



export const routes: Routes = [
  { path: 'chats', loadChildren: '../+chats#ChatsModule'},
]

@Component({
  selector: 'me',
  templateUrl: './me.component.html'
})

export class MeComponent implements OnInit {

  me:model.User;

  constructor(private router:Router) {}

  ngOnInit() {
    this.me = db.User.me;
  }

  logout() {
    db.User.logout().then(() => {
      this.router.navigate(['/signup']);
    })
  }

  toChatComponent() {

      this.router.navigate(['/chats']);

  }
}
