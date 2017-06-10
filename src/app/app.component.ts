/*
 * Angular 2 decorators and services
 */
import {Component, ViewEncapsulation} from '@angular/core';
import { AppState } from './app.service';
import { db , model } from 'baqend/realtime';
import {UserService } from './user.service';


// load alle bootstrap js modules, remove if not needed
import 'bootstrap-sass/assets/javascripts/bootstrap/affix';
import 'bootstrap-sass/assets/javascripts/bootstrap/alert';
import 'bootstrap-sass/assets/javascripts/bootstrap/button';
import 'bootstrap-sass/assets/javascripts/bootstrap/carousel';
import 'bootstrap-sass/assets/javascripts/bootstrap/collapse';
import 'bootstrap-sass/assets/javascripts/bootstrap/dropdown';
import 'bootstrap-sass/assets/javascripts/bootstrap/modal';
import 'bootstrap-sass/assets/javascripts/bootstrap/tooltip';
import 'bootstrap-sass/assets/javascripts/bootstrap/popover';
import 'bootstrap-sass/assets/javascripts/bootstrap/scrollspy';
import 'bootstrap-sass/assets/javascripts/bootstrap/tab';
import 'bootstrap-sass/assets/javascripts/bootstrap/transition';

/*
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app',
  //providers:[UserService],
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    './app.component.scss'
  ],
  template: `
    <nav style="background-color: #00BCD4" class="navbar  ">
    
      <a [routerLink]=" ['./home'] " routerLinkActive="active">
        Home
      </a> 
      <a *ngIf ="currentUser == null" [routerLink]=" ['./signup'] " routerLinkActive="active">
        Login
      </a>  
      <a *ngIf ="currentUser != null" [routerLink]=" ['./signup'] " routerLinkActive="active">
        Logout
      </a>   
      <a [routerLink]=" ['./chatcontainer'] " routerLinkActive="active">
        chats
      </a>     
      
    </nav>
    

    <main class="container-fluid ">
        <router-outlet ></router-outlet>
    </main>   
  `
})
export class AppComponent {
  public angularbaqendLogo = 'assets/Angular+Baqend.svg';
  public name = 'Angular 2 Webpack Starter';
  public url = 'https://twitter.com/AngularClass';
  public baqend = 'https://www.baqend.com';
  currentUser: model.User
  loggedIn: any

  //inject AppState and USerService
  constructor(public appState: AppState, private logedState: UserService) {}


  public ngOnInit() {

    //subscribe to the UserService for changes in the loggedState
    this.logedState.LoggedState.subscribe(item=>{this.currentUser = item; })

   // Initialize currentUser when the db is ready
    db.ready( () => {
      if(db.User.me != null) {
        this.currentUser = db.User.me;
      }else {
        this.currentUser = null
      }
      return Promise.resolve(null);
    }
    )

  }

}

