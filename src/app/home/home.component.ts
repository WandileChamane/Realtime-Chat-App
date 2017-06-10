import {Component, OnInit} from '@angular/core';
import { db } from 'baqend/realtime';
import { Router } from '@angular/router';


@Component({
  selector: 'home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

  //injects the router
  constructor(private router:Router) {}
  public ngOnInit() {}

   //navigates to the chat container when button pressed in template
    public onProceedToChat(){
      if (db.User.me != null){
      this.router.navigate(['/chatcontainer']);
    }
    else {this.router.navigate(['/signup']);}
    }


}
