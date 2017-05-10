import { Component, OnInit, OnDestroy, ViewEncapsulation  } from '@angular/core';
import {db, message, model} from 'baqend/realtime';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'chats-list',
  template: `

    <nav>
      <a [routerLink]=" ['./contacts'] " routerLinkActive="active">Contacts</a>
    </nav>
    
    <main class="container">
    <router-outlet></router-outlet> 
    </main>`,
  styles: [
    `
      .row { margin-top: 20px }
       img { width: 100% }
      .panel { cursor: pointer }
    `
  ]
})
export class ChatcontainerComponent  {

}
