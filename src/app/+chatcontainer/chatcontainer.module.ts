import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

//import { ChatsComponent } from '../+chats/chats.component';
import { DBReady } from '../db.service';
//import { ChatsListComponent } from './chats-list.component';
//import { ChatsDetailsComponent } from './chats-details.component';
//import { ChathistoryComponent } from '../+chat-history/chathistory.component';
import {ChatcontainerComponent} from "../+chatcontainer/chatcontainer.component";
//import {ChatsModule} from "../+chats/";
//loadChildren:'../+chats#ChatsModule'

// async components must be named routes for WebpackAsyncRoute
export const routes : Routes = [
  { path: '', redirectTo: './contacts', pathMatch: 'full', resolve: { db: DBReady } },
  { path: 'contacts', loadChildren:'../+chats#ChatsModule' , resolve: { db: DBReady } },
];

@NgModule({
  declarations: [
    //ChatsComponent,
    // ChatsDetailsComponent,
   // ChathistoryComponent,
    ChatcontainerComponent,

  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
  ]
})
export class ChatcontainerModule {
  static routes = routes;
}
