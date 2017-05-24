import { Component, OnInit, OnDestroy, ViewEncapsulation , Input } from '@angular/core';
import { db, model } from 'baqend/realtime';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from "rxjs/Subscription";

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

   getImageUrl(message) {
    return message.image.url;
  }

   onSubmit() {
    var msg = new db.Message();
    msg.author = db.User.me;
    msg.message = this.user.message;
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
    // If you omit the name parameter, the name of the provided file object is used
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
        console.log('received ' + messages.length + ' messages');
        Promise.all(messages.slice(-20).map(message => {
          return message.load({depth: 1})
        })).then(  messages => {
          this.messages = <Array<model.Message>> messages;
          this.messages.forEach(message => {
            if (message.doc) {
              message.doc.loadMetadata({})
            }
          })
        } )
      } );
  }

  ngOnDestroy() {

    if (this.querySubscription) {
      this.querySubscription.unsubscribe();
    }
  }

}
