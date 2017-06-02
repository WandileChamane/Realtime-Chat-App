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
      
      <a [routerLink]=" ['./chats'] " routerLinkActive="active">
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

  constructor(
    public appState: AppState, private logedState: UserService
  ) {
    //logedState.LoggedOut.subscribe(item=>{this.currentUser = item})

  }

  /*changeLogedState(){
    this.loggedIn = !this.loggedIn
  }*/

  public ngOnInit() {
    this.logedState.LoggedState.subscribe(item=>{this.currentUser = item; })

    //this.loggedIn = true
    console.log('Initial App State', this.appState.state);
    //console.log(db.User.me);
    /*if(db.User != null){
      this.loggedIn = true
    }else {this.loggedIn = false}*/
    db.ready( () => {
      if(db.User.me != null) {
        this.currentUser = db.User.me;
      }else {
        this.currentUser = null
      }
    //  console.log("hey this is the db"+ this.currentUser)
      return Promise.resolve(null);
    }
    )
  }

}

/*
 * Please review the https://github.com/AngularClass/angular2-examples/ repo for
 * more angular app examples that you may copy/paste
 * (The examples may not be updated as quickly. Please open an issue on github for us to update it)
 * For help or questions please contact us at @AngularClass on twitter
 * or our chat on Slack at https://AngularClass.com/slack-join
 */
