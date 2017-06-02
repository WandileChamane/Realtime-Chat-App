import { Component, OnInit, OnDestroy, ViewEncapsulation , Input, ViewChild, ViewChildren,ElementRef } from '@angular/core';
import { db, model } from 'baqend/realtime';
import { ActivatedRoute } from '@angular/router';
import { Subscription,  } from "rxjs/Subscription";
import {Observable} from 'rxjs/Rx';
import {message} from "baqend";
import {promise} from "selenium-webdriver";

@Component({
  selector: 'chats-list',
  templateUrl: `./chathistory.component.html`,
  styles: [
    `
      .row { margin-top: 20px }
       img { width: 100% }
      .panel { cursor: pointer }
    `
  ]
})
export class ChathistoryComponent implements OnDestroy {

  @ViewChild('chatdiv') theChatDiv:ElementRef;
  modalImage;
  private id: string;
  @Input()  theuser: model.User;
  @Input()  theuserID: string;
  private sub: any;
  private querySubscription: Subscription;
  constructor(private route: ActivatedRoute

  ) {}

  theSender = {
    name: ''
  };

  user = {
    message: ''
  };

  notSupportedFile: any
  messages: Array<model.Message>;
  //dommessages: Array<model.Message>;
  //changes: any;

  getImageUrl(message) {
    return message.image.url;
  }

  onSubmit() {
    var msg = new db.Message();
    msg.author = db.User.me;
    msg.message = this.user.message;
    msg.authorName = db.User.me.username;
    msg.receiverName = db.getReference(this.id).username;
    //msg.date = new Date();
    msg.receiver = db.getReference(this.id);
    msg.acl.allowReadAccess(db.User.me);
    msg.acl.allowReadAccess(this.id);
    msg.acl.allowWriteAccess(db.User.me);
    msg.acl.allowWriteAccess(this.id);
    msg.insert({refresh:true}).then();
    this.user.message = null;
   if(this.notSupportedFile == true)
      this.notSupportedFile = false
    //this.theChatDiv.nativeElement.scrollTop = this.theChatDiv.nativeElement.scrollHeight;
  }

  onEnter() {
    this.onSubmit();
  }

  uploadFiles($event) {
    var pendingUploads = [];
    var newId = this.id;
    console.log('this is the name', +$event.target.files[0].name);
    // If you omit the name parameter, the name of the provided file object is used
    var file = new db.File({
      data: $event.target.files[0], type: 'blob',
      parent: '/files'
    });

    if(file.mimeType == 'image/png' || file.mimeType ==  'image/jpeg'||file.mimeType == 'text/plain' || file.mimeType ==  'application/pdf' ){
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
      msg.authorName = db.User.me.username;
      msg.receiverName = db.getReference(newID1).username;
      var messPath = '/files/files/' + file.name;
      msg.acl.allowReadAccess(db.User.me);
      msg.acl.allowReadAccess(newID1);
      msg.acl.allowWriteAccess(db.User.me);
      msg.acl.allowWriteAccess(db.User.me);
      msg.receiver = db.getReference(newID1);
      msg.doc = file;
      msg.fileMimeType = file.mimeType;
      msg.fileName = file.name;
      msg.fileURL = file.url;
      //msg.date = new Date();
      msg.insert({refresh: true});
    });

  }else {
      this.notSupportedFile = true;
    }

  }

  setModalImage(image:any){
    this.modalImage = image;
  }

  imageDownload(image:any){
    image.download;
    console.log('I am here')
  }

  navigationTimer(){
    let timer = Observable.timer(2000,1000);
    timer.subscribe( this.theChatDiv.nativeElement.scrollTop = this.theChatDiv.nativeElement.scrollHeight );

  }

  ngOnInit() {
    this.theSender.name = db.User.me.username;
    //this.theChatDiv.nativeElement.scrollTop = this.theChatDiv.nativeElement.scrollHeight;
  }

  ngOnChanges(changes: any) {
    //this.theChatDiv.nativeElement.scrollTop = this.theChatDiv.nativeElement.scrollHeight;
    console.log(changes)
   // this.changes = true;
    if (this.querySubscription) {
      this.querySubscription.unsubscribe();
    }

    if (this.theuser==null)
      return;

    this.id = this.theuser.id;
    console.log(this.theuser.id)
    //this.messages = [];
    // Initializes ID of the receiver when component is loaded

    // fetches messages of the click user
    console.log('loading messages');
    let queryBuilder = db.Message.find();
    this.querySubscription = queryBuilder.or(queryBuilder.equal('receiver',this.id),(queryBuilder.equal('author', this.id)))
      .resultStream((messages) => {
      //this.messages = messages;

       Promise.all( messages.sort(function(a,b){ var c = a.createdAt.getTime();
        var d = b.createdAt.getTime(); return c-d})).then(messages=>{this.messages =messages;
         this.navigationTimer()});
        }
    );


    /*if(this.changes && this.dommessages!= null){
      Promise.all(
      this.dommessages.sort(function(a,b){ var c = a.noo;
        var d = b.noo; return c-d})).then(messages => {this.messages = messages; })

    }

    this.changes = false;*/

  }

  ngOnDestroy() {

    if (this.querySubscription) {
      this.querySubscription.unsubscribe();
    }
  }

}
