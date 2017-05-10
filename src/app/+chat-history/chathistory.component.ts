import { Component, OnInit, OnDestroy, ViewEncapsulation ,Input } from '@angular/core';
import {db, model} from 'baqend/realtime';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'chats-list',
  template: `
<div *ngIf="theuser">
<div class="container-fluid">
<div  class = "member_list">
 <div *ngFor="let message of messages" class=" row" >
<div *ngIf="theSender.name == message.author.username " class="panel-body pull-right "> 
            <div *ngIf="message.doc != null"  style="background-color: #DDDDDD; padding: 20px" >
            <a style="border:2px ; background-color: #DCF8C6;   padding: 15px; color: black " [href]="message.doc.url">{{message.doc.name}}</a>
          </div>

          <div style="border:2px ; background-color: #DDDDDD;   padding: 15px; color: #77846D " *ngIf="message.message != null"  >
            {{ message.message }}
          </div>
    </div>
    
    <div *ngIf="theSender.name != message.author.username " class="panel-body pull-left"  >
    <div *ngIf="message.doc != null" style="background-color: #DDDDDD; padding: 20px"  >
            <a style="border:2px ; background-color: #DCF8C6;   padding: 15px; color: black " [href]="message.doc.url">{{message.doc.name}}</a>
          </div>
          
     <div style="border:2px ; background-color: #DDDDDD;   padding: 15px; color: #77846D " *ngIf="message.message != null"  >       
          <div class="message-in">
            {{ message.message }}
          </div>
      </div>
    </div>   
</div>
</div>

<div class="row">
<div class="form-group">
  <form #form="ngForm" >
    <div>
      <input  type="text" [(ngModel)]="user.message" class="form-control" (keyup.enter) = "onEnter()"  name="message" required>
    </div>  
    <div class="row">
     <div class="col-xs-5">
    <button class="btn btn-info" type="button" (click)="onSubmit()">Send</button>
    </div>
    <div class="col-xs-5">
    <input  type="file"  (change) ="uploadFiles($event)">
    </div>
    </div>  
  </form>
</div>


</div> 

</div>


  `,
  styles: [
    `
      .row { margin-top: 20px }
       img { width: 100% }
      .panel { cursor: pointer }
    `
  ]
})
export class ChathistoryComponent implements OnDestroy {

  id: string;
  private sub: any;


  @Input() theuser: model.User;   // note to remove
  @Input() theuserID: string;     //note to remove
  constructor(private route: ActivatedRoute

  ) {}

  theSender ={
    name:''
  };

  user = {
    message: ''
  };

  public messages: Array<model.Message>;

  getImageUrl(message) {
    return message.image.url;
  }

  onSubmit(){
    var msg = new db.Message();
    msg.author = db.User.me;
    msg.message = this.user.message;
    msg.date = new Date();
    msg.receiver = db.getReference(this.id);
    msg.acl.allowReadAccess(db.User.me);
    msg.acl.allowReadAccess(this.id);
    msg.insert();
    this.user.message = null;
  }

  onEnter(){
    var msg = new db.Message();
    msg.author = db.User.me;
    msg.message = this.user.message;
    msg.date = new Date();
    msg.receiver = db.getReference(this.id);
    msg.acl.allowReadAccess(db.User.me);
    msg.acl.allowReadAccess(this.id);
    msg.insert();
    this.user.message = null;
  }

  uploadFiles($event) {
    var pendingUploads = [];
    var newId = this.id;
    //If you omit the name parameter, the name of the provided file object is used
      var file = new db.File({data: $event.target.files[0], type: 'blob',
        parent:'/files'
        });
      file.acl.allowReadAccess(db.User.me);
      file.acl.allowWriteAccess(db.User.me);
    file.acl.allowReadAccess(newId);
    file.acl.allowWriteAccess(newId);
      file.upload({force: true}).then(function (file) {
        var msg = new db.Message();
        var newID1 = newId;
        var msg = new db.Message();
        msg.author = db.User.me;
        msg.message = null;
        var messPath = '/files/files/' + file.name;
        msg.acl.allowReadAccess(db.User.me);
        msg.acl.allowReadAccess(newID1);
        msg.acl.allowWriteAccess(db.User.me);
        msg.acl.allowWriteAccess(db.User.me);
        msg.receiver = db.getReference(newID1);
        msg.doc = file;
        msg.date = new Date();
        msg.insert();
      });
  }

  ngOnInit() {
   this.theSender.name = db.User.me.username;

  }

  ngOnChanges(changes: any) {
    if (this.sub) {
      console.log('unsubscribe');
      this.sub.unsubscribe();
    }

    this.messages = [];

    //console.log("the user ID is"+this.theuserID );
    //Initializes ID of the receiver when component is loaded
    this.sub = this.route.params.subscribe(params => {
      this.id = '/db/User/' + this.theuserID; //
    });


    //fetches messages of the click user
    console.log('loading messages');
   // console.log('loading messages');
    var queryBuilder = db.Message.find();
    queryBuilder.or(queryBuilder.equal('receiver',this.id),(queryBuilder.equal('author', this.id)))
      .resultStream(messages => {
        console.log('received ' + messages.length + ' messages');
        Promise.all(messages.sort((a,b) => a.date.getTime() - b.date.getTime()).slice(-8).map(message => {
          console.log("second load");
          return message.load({depth: 1})
        })).then(  messages => this.messages = <Array<model.Message>> messages )
      } );




  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
