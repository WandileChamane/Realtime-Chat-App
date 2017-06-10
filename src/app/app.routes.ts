import { Routes } from '@angular/router';
import { HomeComponent } from './home';
import { AboutComponent } from './about';
import { NoContentComponent } from './no-content';
import { SignupComponent } from './signup';
import { MeComponent } from './me';
import { DBReady, DBLoggedIn } from './db.service';
import {ChatcontainerComponent} from "./+chatcontainer/chatcontainer.component";
//import {ChatcontainerModule} from "./+chatcontainer/chatcontainer.module";
//import { ChatcontainerComponent } from './+chatcontainer/chatcontainer.component' ;
//import {ChatsComponent} from './+chats/chats.component';

export const ROUTES: Routes = [
  { path: '',      component: HomeComponent, resolve: { db: DBReady } },
  { path: 'home',  component: HomeComponent, resolve: { db: DBReady } },
  { path: 'about', component: AboutComponent },
  { path: 'detail', loadChildren: './+detail#DetailModule'},
  { path: 'barrel', loadChildren: './+barrel#BarrelModule'},
  { path: 'signup', component: SignupComponent, resolve: { db: DBReady } }, //will activate the route after the db is ready
  { path: 'me', component: MeComponent, canActivate: [DBLoggedIn] }, //will prevent none logged in users from accessing it
  { path: 'chats', loadChildren: './+chats#ChatsModule'},
  { path: '**',    component: NoContentComponent },
  //{ path: 'ch',  component: AboutComponent }
];
