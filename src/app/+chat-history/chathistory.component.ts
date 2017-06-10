import { Component, OnDestroy, ViewChild,ElementRef } from '@angular/core';
import { db, model } from 'baqend/realtime';
import { ActivatedRoute } from '@angular/router';
import { Subscription,  } from "rxjs/Subscription";
import {Observable} from 'rxjs/Rx';
import {ChatService} from '../chat.service'


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

//responsible for displaying the chat history with a User
export class ChathistoryComponent implements OnDestroy {

  @ViewChild('chatdiv') theChatDiv:ElementRef;
  modalImage;
  private theReceiveUserID: string;
  routerSub: any
  theuser: model.User;
  private sub: any;
  private querySubscription: Subscription;
  notSupportedFile: any
  messages: Array<model.Message>;
  constructor(private route: ActivatedRoute, private userObject: ChatService) {}

  theSender = {
    name: ''
  };

  user = {
    message: ''
  };

  getImageUrl(message) {
    return message.image.url;
  }

  /* event called when user presses submit button for a message.
     */
  onSubmit() {
    //sets reference to the message at baqend
    var msg = new db.Message();
    msg.author = db.User.me;
    msg.message = this.user.message;
    msg.authorName = db.User.me.username;
    msg.receiverName = db.getReference(this.theReceiveUserID).username;
    msg.receiver = db.getReference(this.theReceiveUserID);

    //sets those who can access the message(only the sender and receiver can),
    //Uploads the message
    msg.acl.allowReadAccess(db.User.me);
    msg.acl.allowReadAccess(this.theReceiveUserID);
    msg.acl.allowWriteAccess(db.User.me);
    msg.acl.allowWriteAccess(this.theReceiveUserID);
    msg.insert({refresh:true}).then();
    this.user.message = null;

    //clears the display: "file is not supported" when a new message is sent
    if(this.notSupportedFile == true)
      this.notSupportedFile = false
  }

  //does the same action as onSubmit() when Enter button is pressed
  onEnter() {
    this.onSubmit();
  }
  //called when a file is sent to a user
  uploadFiles($event) {

    var thereceiverID = this.theReceiveUserID;

    //create new file object to be uploaded to baqend
    var file = new db.File({
      data: $event.target.files[0], type: 'blob',
      parent: '/files'
    });

    // checks the file type before upload to ensure that it is either  image,
    // or text or pdf
    if(file.mimeType == 'image/png' || file.mimeType == 'image/jpeg'
      ||file.mimeType == 'text/plain' || file.mimeType ==  'application/pdf' ) {

      //set access level on file to only sender and receiver
    file.acl.allowReadAccess(db.User.me);
    file.acl.allowWriteAccess(db.User.me);
    file.acl.allowReadAccess(thereceiverID);
    file.acl.allowWriteAccess(thereceiverID);

    // upload the file, then insert a message into MessageTodo
      //  with reference to the file
    file.upload({force: true}).then(function (file) {
      var msg = new db.Message();
      var receiverID = thereceiverID;
      msg.author = db.User.me;
      msg.message = null;
      msg.authorName = db.User.me.username;
      msg.receiverName = db.getReference(receiverID).username;
      msg.receiver = db.getReference(receiverID);
      msg.doc = file;
      msg.fileMimeType = file.mimeType;
      msg.fileName = file.name;
      msg.fileURL = file.url;

      //set acl for the file message inserted into MessageTodo
      msg.acl.allowReadAccess(db.User.me);
      msg.acl.allowReadAccess(receiverID);
      msg.acl.allowWriteAccess(db.User.me);
      msg.acl.allowWriteAccess(db.User.me);
      msg.insert({refresh: true});
    });

      //set true if the file was type is not supported
  }else {
      this.notSupportedFile = true;
    }

  }

  //set modal Image URL when Image clicked
  setModalImage(image:any){
    this.modalImage = image;
  }

  //Download a file
  imageDownload(image:any){
    image.download;
  }

  //set a timer and then navigate to bottom of div
  navigationTimer(){
    let timer = Observable.timer(2000,1000);
    timer.subscribe( this.theChatDiv.nativeElement.scrollTop = this.theChatDiv.nativeElement.scrollHeight );
  }

  ngOnInit() {
    this.theSender.name = db.User.me.username;
    //subscribes to route parameter(called whenever the user change),
    //then calls getUserObject() of the userService
    // then initializes this.theuser with the user gotten from userservice
    //then calls getMessagesFromBaqend()
    this.routerSub = this.route.params.subscribe(() => {
      this.userObject.getUserObject().then(item => {this.theuser = item; this.getMessagesFromBaqend(); })
   });
  }


  //populates the this.messages array with the list of messages btw two users
  getMessagesFromBaqend() {

    // ensures any subscription to baqend realtime resultstream is cancelled
    // so as not to create multiple subscriptions
    if (this.querySubscription) {
      this.querySubscription.unsubscribe();
    }

    //ensures a user is selected before proceeding
    // serves as a guard when a user has not been selected so as not to cause an error
    if (this.theuser==null)
      return;

    //initializes this.theReceiveUserID whenever a new user is clicked
    this.theReceiveUserID = this.theuser.id;

    /*create a subscription to baqend realtime resultstream(), then
    loads the messages that are for the sender
    and receiver(n.b only messages that the sender and receiver have acl permission to),
    then sorts the message by time, places the message in this.messages array and call navigationTimer() */
    let queryBuilder = db.Message.find();
    this.querySubscription = queryBuilder
      .or(queryBuilder.equal('receiver',this.theReceiveUserID),(queryBuilder.equal('author', this.theReceiveUserID)))
      .resultStream((messages) => {
       Promise.all( messages.sort(function(a,b){ var c = a.createdAt.getTime();
        var d = b.createdAt.getTime(); return c-d})).then(messages=>{this.messages =messages;
         this.navigationTimer()});
        }
    );

  }

  //callled when component is destroyed
  ngOnDestroy() {

    //destroys subscription to chat service if any
    if(this.routerSub) {
      this.routerSub.unsubscribe
    }

    //destroys subscription to the realtime resultstream of baqend if any
    if (this.querySubscription) {
      this.querySubscription.unsubscribe();
    }
  }

}
