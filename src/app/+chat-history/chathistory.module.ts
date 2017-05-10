import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ChatsComponent } from './chats.component';
import { DBReady } from '../db.service';
import {db, model} from 'baqend/realtime';  // note to remove

//import { routes } from './chathistory.routes';
import { ChathistoryComponent } from './chathistory.component';

// async components must be named routes for WebpackAsyncRoute


console.log('`Barrel` bundle loaded asynchronously');

@NgModule({
  declarations: [
    // Components / Directives/ Pipes
    ChathistoryComponent,
  ],
  imports: [
    CommonModule,
    //RouterModule.forChild(routes),
    FormsModule,
 //   RouterModule.forChild(routes),
  ],
})
export class ChathistoryModule {

 // public static routes = routes;
}
