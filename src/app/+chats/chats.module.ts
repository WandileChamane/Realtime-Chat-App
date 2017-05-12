import { CommonModule } from '@angular/common';
import { NgModule, } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ChatsComponent } from './chats.component';
import { DBReady } from '../db.service';
import { ChatsListComponent } from './chats-list.component';
import { ChathistoryComponent } from '../+chat-history/chathistory.component';

// async components must be named routes for WebpackAsyncRoute
export const routes: Routes = [
  { path: '', component: ChatsComponent, pathMatch: 'full', resolve: { db: DBReady } },
  { path: 'chathistory/:id', component: ChathistoryComponent, resolve: { db: DBReady } },
];

@NgModule({
  declarations: [
    ChatsComponent,
    ChathistoryComponent,

  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
  ]
})
export class ChatsModule {
  public static routes = routes;
}
