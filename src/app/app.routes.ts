import { Routes } from '@angular/router';
import { HomeComponent } from './home';

import { NoContentComponent } from './no-content';
import { SignupComponent } from './signup';
import { MeComponent } from './me';
import { DBReady, DBLoggedIn } from './db.service';
import {ChatcontainerComponent} from "./chat-container/chatcontainer.component";

import {FriendlistComponent} from './friendlist/friendlist.component';
import { ChathistoryComponent } from './+chat-history/chathistory.component';

export const ROUTES: Routes = [
  { path: '',      component: HomeComponent, resolve: { db: DBReady } },
  { path: 'home',  component: HomeComponent, resolve: { db: DBReady } },
  { path: 'chatcontainer', resolve: { db: DBReady }, component: ChatcontainerComponent,
    children:[
      {path:'', redirectTo:'friendlist', pathMatch:'full'},
      {path:'friendlist', component:FriendlistComponent, resolve: { db: DBReady },
      children:[
        {path:'chathistory/:id', component:ChathistoryComponent , resolve: { db: DBReady }}
      ]}]},

  { path: 'signup', component: SignupComponent, resolve: { db: DBReady } }, //will activate the route after the db is ready
  { path: 'me', component: MeComponent, canActivate: [DBLoggedIn] }, //will prevent none logged in users from accessing it
  { path: '**',    component: NoContentComponent },

];
