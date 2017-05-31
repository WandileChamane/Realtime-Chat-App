import {Component, OnInit} from '@angular/core';
import { db , model } from 'baqend/realtime';
import { AppState } from '../app.service';
import { Title } from './title';
import { Routes,Router,  RouterModule } from '@angular/router';
import { SignupComponent } from '../signup';
import { DBReady, DBLoggedIn } from '../db.service';
import { XLargeDirective } from './x-large';

/*const homeRoutes: Routes = [
   { path: 'chats', loadChildren: '../+chats#ChatsModule'},
   { path: 'signup', component: SignupComponent, resolve: { db: DBReady } },
];*/

@Component({
  // The selector is what angular internally uses
  // for `document.querySelectorAll(selector)` in our index.html
  // where, in this case, selector is the string 'home'
  selector: 'home',  // <home></home>
  // We need to tell Angular's Dependency Injection which providers are in our app.
  providers: [
    Title
  ],
  // Our list of styles in our component. We may add more to compose many styles together
  styleUrls: [ './home.component.css' ],
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  // Set our default values
  public localState = { value: '' };
  // TypeScript public modifiers
  constructor(private router:Router,
    public appState: AppState,
    public title: Title

  ) {}

  public ngOnInit() {
    console.log('hello `Home` component');
    // this.title.getData().subscribe(data => this.data = data);
  }

    public onProceedToChat(){
      if (db.User.me != null){
      this.router.navigate(['/chats']);
    }
    else {this.router.navigate(['/signup']);}

    }

  public submitState(value: string) {
    console.log('submitState', value);
    this.appState.set('value', value);
    this.localState.value = '';
  }
}
