import { Component, OnInit, OnDestroy, ViewEncapsulation , Input } from '@angular/core';
import { db, model } from 'baqend/realtime';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from "rxjs/Subscription";
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

  messages: Array<model.Message>;
  dommessages: Array<model.Message>;

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
    msg.insert();
    this.user.message = null;
  }

  onEnter() {
    var msg = new db.Message();
    msg.author = db.User.me;
    msg.message = this.user.message;
    msg.authorName = db.User.me.username;
    msg.receiverName = db.getReference(this.id).username;
    // msg.date = new Date();
    msg.receiver = db.getReference(this.id);
    msg.acl.allowReadAccess(db.User.me);
    msg.acl.allowReadAccess(this.id);
    msg.acl.allowWriteAccess(db.User.me);
    msg.acl.allowWriteAccess(this.id);
    msg.insert();
    this.user.message = null;
  }

  uploadFiles($event) {
    var pendingUploads = [];
    var newId = this.id;
    console.log('this is the name', + $event.target.files[0].name);
    // If you omit the name parameter, the name of the provided file object is used
    var file = new db.File({name:$event.target.files[0].name+db.User.me+db.getReference(this.id).username,data: $event.target.files[0], type: 'blob',
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
      msg.insert();
    });
  }

  setModalImage(image:any){
    this.modalImage = image;
  }

  imageDownload(image:any){
    image.download;
    console.log('I am here')
  }

  ngOnInit() {
    this.theSender.name = db.User.me.username;

  }

  ngOnChanges(changes: any) {
    console.log(changes)

    if (this.querySubscription) {
      this.querySubscription.unsubscribe();
    }

    if (!this.theuserID)
      return;

    this.id = '/db/User/' + this.theuserID;
    console.log(this.id)
    this.messages = [];
    // Initializes ID of the receiver when component is loaded

    // fetches messages of the click user
    console.log('loading messages');
    let queryBuilder = db.Message.find();
    this.querySubscription = queryBuilder.or(queryBuilder.equal('receiver',this.id),(queryBuilder.equal('author', this.id)))
      .resultStream((messages) => {
      this.dommessages = messages;
        this.dommessages.sort((a,b)=>a.noo-b.noo);
    this.messages =this.dommessages;}
    );
  }

  ngOnDestroy() {

    if (this.querySubscription) {
      this.querySubscription.unsubscribe();
    }
  }

}
