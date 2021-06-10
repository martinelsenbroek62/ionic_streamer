import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Message } from '../interfaces/message';
import { User } from '../interfaces/user';
import { ChatService } from '../services/chat.service';
import { map, timeout } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ActionSheetController, Gesture, GestureController, IonContent, IonInput, IonItem, ModalController, Platform, ToastController } from '@ionic/angular';
import { UtilityService } from '../services/utility.service';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { Router } from '@angular/router';
import { Group } from '../interfaces/group';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { GroupInfoModalPage } from '../group-info-modal/group-info-modal.page';
import { GoogleMaps, GoogleMap, GoogleMapsEvent, Marker, GoogleMapsAnimation, MyLocation } from '@ionic-native/google-maps';
import { CcutilService } from 'src/app/services/ccutil.service';
import { MessageHeader } from '../interfaces/message-header';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit, AfterViewInit {

  @ViewChild(IonContent, { static: false }) content: IonContent;
  @ViewChild('groupName') groupNameElement: IonInput;

  map: GoogleMap;

  friendsList: any = [
    {
      firstName: 'Srikanth',
      lastName: 'Reddy',
      profileImagePath: 'null',
      status: '',
      userId: 896832,
    }
  ];
  users: any;
  usersToAddInGroup: any;
  // users: any = [
  //   {
  //     id: 1,
  //     firstName: 'Ankit',
  //     lastName: '',
  //     message: 'You sent an attachment',

  //     dayDate: 'Sat',
  //     isLive: false,
  //     readUnread: 'no',
  //     type: 'message'
  //   },
  //   {
  //     id: 2,
  //     firstName: 'Pavan',
  //     lastName: '',
  //     message: "That's good to know",
  //     dayDate: 'Thu',
  //     isLive: false,
  //     readUnread: '1',
  //     type: 'message'
  //   },
  //   {
  //     id: 3,
  //     t1_logo_file_path: "/documentsRep/teamLogos/lions.jpg",
  //     t2_logo_file_path: "/documentsRep/teamLogos/80287e2e-59dc-4f43-82c1-3c859e2a886c.jpg",
  //     teamOne: 209,
  //     teamOneName: "CSK",
  //     teamTwo: 206,
  //     teamTwoName: "HYD",
  //     type: 'match'
  //   },
  //   {
  //     id: 4,
  //     firstName: 'Kathya',
  //     lastName: '',
  //     message: 'Thanks',
  //     dayDate: '21, Dec 2020',
  //     isLive: true,
  //     readUnread: 'yes',
  //     type: 'message'
  //   },
  //   {
  //     id: 5,
  //     firstName: 'Lakshman',
  //     lastName: '',
  //     message: 'Hi Ankit, please connect at 10 am to review the code.',
  //     dayDate: 'Yesterday',
  //     isLive: true,
  //     readUnread: '2',
  //     type: 'message'
  //   },
  //   {
  //     id: 6,
  //     title: 'CricStores',
  //     description: 'Avail upto 25% discount...',
  //     imagePath: "/documentsRep/logos/defaultLogo.png",
  //     type: 'store'
  //   },
  // ];
  searchFilterTerm: string;
  showUserSearchBar = false;
  addUserInGroupActive = false;
  chatId: any;
  loadMapList = {};

  messages: any;
  alternate: any;
  userLoggedIn = {
    userId: '',
    userIdArray: [],
    userName: '',
    index: -1,
    timestamp: '',
    profileImagePath: undefined
  };
  userReceiver: any = {
    userId: '',
    userIdArray: [],
    firstName: '',
    lastName: '',
    index: -1,
    timestamp: '',
    connections: undefined,
    profileImagePath: undefined
  };

  data: any = {
    message: ''
  };

  isMessageForwarding = false;
  showListOfMessages = false;
  // using when users are pressed to create group
  pressedUserIdList: any = {};
  pressedUserElementList: any = {};
  // using when messages are pressed to copy or forward
  pressedMsgTextList: any = {};
  pressedMsgElementList: any = {};
  // user list to whom forwarding message
  msgForwardUserList: any = {};
  // item element to whom forwarding message
  itemElemForwardUserList: any = {};

  private lastOnStart = 0;
  private LONG_PRESS_THRESHOLD = 500;
  private CLICKED_THRESHOLD = 500;

  // all for groups
  createNewGroupActive = 0;
  newGroupName: any;
  // editGroupTo may have value 'add' or 'remove'
  editGroupTo = '';
  messagesHeader: any;

  constructor(private utilityService: UtilityService, private chatService: ChatService, 
    private gestureCtrl: GestureController, private elementRef: ElementRef, private clipboard: Clipboard, private router: Router, public toastController: ToastController, private actionSheetController: ActionSheetController, private geolocation: Geolocation, public modalController: ModalController, private platform: Platform, public ccUtil: CcutilService) {
    if (localStorage.getItem('userId')) {
      this.userLoggedIn.userId = localStorage.getItem('userId');
      this.userLoggedIn.profileImagePath = localStorage.getItem('profileImage');
      this.userLoggedIn.userName = localStorage.getItem('fName') + ' ' + localStorage.getItem('lName');
    }
    // this.addFriend(1667524);
  }

  async ngOnInit() {
    // Since ngOnInit() is executed before `deviceready` event,
    // you have to wait the event.
    await this.platform.ready();
    // await this.loadMap();

    this.getMessagesHeader();
    this.getFriendsList();
    // await this.getUsers();
  }

  doRefresh(event) {
    this.getMessagesHeader();
    this.getFriendsList();
    // hide loading spinner after 5 sec.
    setTimeout(() => {
      event.target.complete();
    }, 3000);
  }

  loadMap(id) {
    this.map = GoogleMaps.create(id, {
      camera: {
        target: {
          lat: 43.0741704,
          lng: -89.3809802
        },
        zoom: 18,
        tilt: 30
      }
    });
    // assign value in array to avoid duplicate initialization
    this.loadMapList[id] = true;
  }

  ngAfterViewInit() {
  }

  isEmptyObject(obj) {
    return (obj && (Object.keys(obj).length === 0));
  }

  getObjectKeys(object) {
    return Object.keys(object);
  }

  // getUserByUserId(userId) {
  //   if (userId && this.users) {
  //     return this.users.find(o => (o.userId == userId));
  //   }
  // }

  addFriend(friendUserId) {
    // call an API
    this.chatService.addFriend(friendUserId)
    .subscribe((value: any) => {
      // check response
      if (value.responseState && value.data) {
        console.log(value.data);
      } else {
        console.log('Failed to call API');
      }
    }, (error) => {
      console.log('Api error');
      if(error.name == 'HttpErrorResponse')
        this.ccUtil.fail_modal('Please check your Network Connection');
      else
        this.ccUtil.fail_modal(error.message);
    });
  }

  // ADD LONG PRESS TO ANYTHING - WE MAY USE THIS FUNCTION FOR ANYTHING
  // NOT USING THIS FUNCTION FOR NOW
  /*
  addLongPressEventToUsers () {
    // create a new HTMLElement from nativeElement
    const htmlElement: ElementRef = this.elementRef;

    // simply get elements with class name
    const userItemArray = htmlElement.nativeElement.querySelectorAll('.user-wrap');

    for (let i=0; i < userItemArray.length; i++) {
      const messageItem = userItemArray[i];
      // console.log('userItem', userItem);

      const gesture: Gesture = this.gestureCtrl.create({
        el: messageItem,
        threshold: 0,
        gestureName: 'long-press',
        onStart: ev => {
          // console.log('onStart ev', ev);
          const now = Date.now();
          this.lastOnStart = now;
        },
        onEnd: ev => {
          const target: any = ev.event.target;
          // get pressed element
          const userElem = target.closest('.user-wrap');
          const userId = userElem.getAttribute('id');

          // console.log('onEnd ev', ev);
          const now = Date.now();
          // WHEN SINGLE CLICKED, open messages list page for that user
          if (Math.abs(now - this.lastOnStart) < this.CLICKED_THRESHOLD) {
            const user = this.users.find(o => (o.userId == userId));
            this.showMessages(user, ev);
          }
          // WHEN LONG PRESSED, select users to create group
          else if (Math.abs(now - this.lastOnStart) >= this.LONG_PRESS_THRESHOLD) {
            // console.log('Long press worked.');
            this.lastOnStart = 0;

            // add only if not added
            if (!this.pressedUserElementList[userId]) {
              this.pressedUserElementList[userId] = userElem;
              // set background color to selected element
              // this.pressedUserElementList[id].style.background = '#d7d8da';
              this.pressedUserElementList[userId].setAttribute('style', '--background: #d7d8da');
              // get selected text message and assign in local var
              this.pressedUserIdList[userId] = userId;
            } else {
              // remove background color
              this.pressedUserElementList[userId].setAttribute('style', '--background: none');
              // remove if already exist - means user has unselected user from selection
              delete this.pressedUserElementList[userId];
              delete this.pressedUserIdList[userId];
            }
          }
        }
      }, true);
      gesture.enable(true);
      // The `true` above ensures that callbacks run inside NgZone.
    }
  }
  */

  addLongPressEventToMessages() {
    // create a new HTMLElement from nativeElement
    const htmlElement: ElementRef = this.elementRef;

    // simply get elements with class name
    const messageItemArray = htmlElement.nativeElement.querySelectorAll('.msg-wrap');

    for (let i=0; i < messageItemArray.length; i++) {
      const messageItem = messageItemArray[i];
      // console.log('messageItem', messageItem);

      const gesture: Gesture = this.gestureCtrl.create({
        el: messageItem,
        threshold: 0,
        gestureName: 'long-press',
        onStart: ev => {
          // console.log('onStart ev', ev);
          const now = Date.now();
          this.lastOnStart = now;
        },
        onEnd: ev => {
          // console.log('onEnd ev', ev);
          const now = Date.now();
          if (Math.abs(now - this.lastOnStart) >= this.LONG_PRESS_THRESHOLD) {
            // console.log('Long press worked.');
            this.lastOnStart = 0;

            const target: any = ev.event.target;
            if (target.getElementsByClassName('msgTxt')[0]) {
              // get pressed element
              const msgElem = target.closest('.message');
              const id = msgElem.getAttribute('id');
              // add only if not added
              if (!this.pressedMsgElementList[id]) {
                this.pressedMsgElementList[id] = msgElem;
                // set background color to selected element
                this.pressedMsgElementList[id].style.background = '#d7d8da';
                // get selected text message and assign in local var
                this.pressedMsgTextList[id] = target.getElementsByClassName('msgTxt')[0].innerHTML;
              } else {
                // remove background color
                this.pressedMsgElementList[id].style.background = '';
                // remove if already exist - means user has unselected msg from selection
                delete this.pressedMsgElementList[id];
                delete this.pressedMsgTextList[id];
              }
            }
          }
        }
      }, true);
      gesture.enable(true);
      // The `true` above ensures that callbacks run inside NgZone.
    }
  }

  deleteMessage() {
    // get all the message elements which are selected to delete
    for (const key of Object.keys(this.pressedMsgElementList)) {
      // this key is a message id - we will use this to delete message for this user
      // call a function to delete message for this user
      this.deleteMessageForMe(this.chatId, key);
    }
    // clear all
    this.clearPressedElementsBackground();
  }

  doMessagesCopy() {
    let combineTxt = '';
    for (const key of Object.keys(this.pressedMsgTextList)) {
      const value = this.pressedMsgTextList[key];
      // combine text with newline/nextline character
      if (combineTxt === '') {
        combineTxt = value;
      } else {
        combineTxt = combineTxt + '\n\n' + value;
      }
    }
    // copy combined text to clipboard to allow paste anywhere
    this.clipboard.copy(combineTxt);
  }

  copyMsgToClipboard() {
    this.doMessagesCopy();
    this.utilityService.presentToast('Message copied', 'medium', 'middle', 1500, 'msg-copied-toast');
    // clear all
    this.clearPressedElementsBackground();
  }

  copyAndShare() {
    // do copy so that we can use this value for sharing with others
    this.doMessagesCopy();
    // go back to previous view (list of users) and allow user to share with selected users
    this.showListOfMessages = false;
    // set it to true to allow selecting user to forward message
    this.isMessageForwarding = true;
    // clear all
    this.clearPressedElementsBackground();
  }

  clearPressedElementsBackground() {
    for (const key of Object.keys(this.pressedMsgElementList)) {
      const value = this.pressedMsgElementList[key];
      // remove background color
      value.style.background = '';
    }
    // clear pressed element list and messsages
    this.pressedMsgElementList = {};
    this.pressedMsgTextList = {};
    this.pressedUserElementList = {};
    this.pressedUserIdList = {};
  }

  getDateString(timestamp) {
    if (this.utilityService.getDateString(timestamp)) {
      return this.utilityService.getDateString(timestamp);
    }
  }

  scrollToBottom() {
    this.content.scrollToBottom(0);

    this.addLongPressEventToMessages();
  }

  // add events
  inputUp() {
    // if (isIOS) $scope.data.keyboardHeight = 216;
    setTimeout(() => {
      // ScrollToBottom
      this.content.scrollToBottom(1500);
    }, 300);
  };

  onKeydown($event) {
    // 13 means 'enter' key is pressed
    if ($event.keyCode === 13) {
      // send message and close keyboard
      this.sendMessage('TEXT');
      this.closeKeyboard();
    }
  }

  closeKeyboard() {
    // cordova.plugins.Keyboard.close();
  };

  /* // WE MAY USE THIS LATER
  async createUser() {
    const user: User = {
      id: '1',
      userId: '1',
      username: 'Ankit',
      email: 'ankit@cricclubs.com',
      profileImg: '',
      profileThumb: ''
    }
    await this.chatService.writeUserData(user);
    console.log('Create user.');
  }
  */

  // async getUsers() {
  //   const users: Observable<any[]> = await this.chatService.readUsersData();
  //   // since this messages is observable, pipe is required to get mapped values
  //   users.pipe(
  //     map(changes =>
  //       changes.map(c =>
  //         // add key of an object to current object
  //         ({ key: c.payload.key, ...c.payload.val() })
  //       )
  //     )
  //   ).subscribe(data => {
  //     // console.log('messages', data);
  //     this.users = data;
  //   });
  // }

  userCircleClicked(user) {
    // // create new user in firebase
    // this.chatService.createUpdateUser(user);
    // // check and create new user - if user not created in firebase
    // const index = this.users.findIndex((o) => o.userId == user.userId);
    // if (index == -1) {
    //   // also add in existing users list
    //   this.users.unshift(user);
    // }
    // open clicked user messages
    this.messagesHeader = {};
    // check if clicked user is already in users list
    const found = this.users.find((o) => (o.userArr.indexOf(user.userId) > -1));
    if (found) {
      this.messagesHeader = found;
      this.showMessages(undefined, this.messagesHeader);
    } else {
      this.showMessages(user, undefined);
    }
  }

  showMessagesOfUser(event, messagesHeader) {
    this.messagesHeader = messagesHeader;
    // else open clicked user messages
    this.showMessages(undefined, messagesHeader, event);
  }

  selectUserToAddInGroup(event, messagesHeader) {
    // toggle user when clicked
    const target: any = event.target;
    // get pressed element
    const userElem = target.closest('.user-wrap');
    // add only if not added
    if (!this.pressedUserElementList[messagesHeader.userId]) {
      this.pressedUserElementList[messagesHeader.userId] = userElem;
      // set background color to selected element
      // this.pressedUserElementList[id].style.background = '#d7d8da';
      this.pressedUserElementList[messagesHeader.userId].setAttribute('style', '--background: #d7d8da');
      // get selected text message and assign in local var
      this.pressedUserIdList[messagesHeader.userId] = messagesHeader;
    } else {
      // remove background color
      this.pressedUserElementList[messagesHeader.userId].setAttribute('style', '--background: none');
      // remove if already exist - means user has unselected user from selection
      delete this.pressedUserElementList[messagesHeader.userId];
      delete this.pressedUserIdList[messagesHeader.userId];
    }
  }

  // async countUnreadMessages(index, userId) {
  //   const chatId = this.chatService.getChatId(this.userLoggedIn.userId, userId);
  //   // get last one message that is sent or received
  //   // load messages from database
  //   const messages: Observable<any[]> = await this.chatService.countUnreadMessages(chatId);
  //   // since this messages is observable, pipe is required to get mapped values
  //   messages.pipe(
  //     map(changes =>
  //       changes.map(c =>
  //         // add key of an object to current object
  //         ({ key: c.payload.key, ...c.payload.val() })
  //       )
  //     )
  //   ).subscribe(data => {
  //     console.log('getLastMessage messages', data);
  //     // data will always an array with one object because limit given is 1
  //     if (data && data.length > 0) {
  //       for (const user of data) {
  //         // if last message unread and sender user is loggedin/current user - show single tick
  //         if (user.userIdSender == this.userLoggedIn.userId) {
  //           this.friendsList[index]['readUnread'] = 'no';
  //         } else {
  //           // if logged in user is not sender user means message is received which is not read by current/loggedin user
  //           // in that case show length
  //           this.friendsList[index]['readUnread'] = data.length;
  //         }
  //       }
  //     } else {
  //       // if not found any unread messages than show double tick
  //       this.friendsList[index]['readUnread'] = 'yes';
  //     }
  //   });
  // };

  // async getLastMessage(index, userId) {
  //   const chatId = this.chatService.getChatId(this.userLoggedIn.userId, userId);
  //   // get last one message that is sent or received
  //   // load messages from database
  //   const messages: Observable<any[]> = await this.chatService.readMessageData(chatId, 1);
  //   // since this messages is observable, pipe is required to get mapped values
  //   messages.pipe(
  //     map(changes =>
  //       changes.map(c =>
  //         // add key of an object to current object
  //         ({ key: c.payload.key, ...c.payload.val() })
  //       )
  //     )
  //   ).subscribe(data => {
  //     console.log('messages', data);
  //     // data will always an array with one object because limit given is 1
  //     if (data && data.length > 0) {
  //       this.friendsList[index]['message'] = data[0].text;
  //       const dateTime = this.utilityService.getDateString(data[0].timestamp);
  //       // check if this date is too old show date else time and its too early show day
  //       this.friendsList[index]['dayDate'] = dateTime.time;
  //       if (!this.users) {
  //         this.users = [];
  //       }
  //       // add to users list - the list to whom already chatted with
  //       const userFoundIndex = this.users.findIndex((o) => o.userId == this.friendsList[index].userId);
  //       if (userFoundIndex == -1) {
  //         this.users.push(this.friendsList[index]);
  //       } else {
  //         // update
  //         this.users[userFoundIndex] = this.friendsList[index];
  //       }
  //       // get count of unread messages
  //       this.countUnreadMessages(index, userId);
  //     } else {
  //       this.users = [];
  //       // no need to get count of unread messages when no messages found
  //       this.friendsList[index]['readUnread'] = '';
  //     }
  //   });
  // };

  showMessages(user, messagesHeader, event?) {
    if (!this.isMessageForwarding) {
      // open user messages
      this.showListOfMessages = true;
      this.userReceiver = {};
      // check and set
      if (!this.userReceiver.userIdArray) {
        this.userReceiver.userIdArray = [];
      }
      if (this.userReceiver.userIdArray.indexOf(this.userReceiver.userId) == -1)
        this.userReceiver.userIdArray.push(Number(this.userReceiver.userId));

      // set users index in user object to get selected user to chat
      if (this.users && this.users.length > 0)
        this.userReceiver.index = this.users.findIndex(o => (o.userId === this.userReceiver.userId));
      // get messages
      if (messagesHeader && messagesHeader.groupName) {
        // if clicked element is group means messagesHeader.groupName
        this.userReceiver.timestamp = messagesHeader.timestamp.seconds;
        this.userReceiver.groupName = messagesHeader.groupName;
        this.userReceiver.userIdArray = this.getUserIdsExceptCurrentUserId(messagesHeader.userArr);
        this.userReceiver.profileImagePath = messagesHeader.profileImagePath;
        this.getMessages(messagesHeader.id);
      } else if (messagesHeader) {
        // if clicked element is userName means messagesHeader.userName
        this.userReceiver.timestamp = messagesHeader.timestamp.seconds;
        this.userReceiver.userName = messagesHeader.userName;
        this.userReceiver.userIdArray = this.getUserIdsExceptCurrentUserId(messagesHeader.userArr);
        this.userReceiver.profileImagePath = messagesHeader.profileImagePath;
        this.getMessages(messagesHeader.id);
      } else {
        // chat with new user
        this.userReceiver.userName = user.firstName ? (user.firstName + ' ' + user.lastName) : '';
        this.userReceiver.userIdArray = [user.userId];
        this.userReceiver.userId = user.userId;
        this.userReceiver.profileImagePath = user.profileImagePath;
        this.getMessages(undefined);
      }
    } else {
      if (event) {
        const item = event.target.closest('ion-item');
        if (!this.msgForwardUserList[user.userId]) {
          this.itemElemForwardUserList[user.userId] = item;
          // add user in forward message user list
          this.msgForwardUserList[user.userId] = user;
          // set background color
          item.setAttribute('color', 'light');
        } else {
          // remove user from forward message user list
          delete this.msgForwardUserList[user.userId];
          delete this.itemElemForwardUserList[user.userId];
          // remove background color
          item.setAttribute('color', '');
        }
      }
    }
  }

  clearForwarding() {
    this.isMessageForwarding = false;
    this.msgForwardUserList = {};
    // remove background color
    for (const key of Object.keys(this.itemElemForwardUserList)) {
      const item = this.itemElemForwardUserList[key];
      item.setAttribute('color', '');
    }
  }

  async sendForwardedMessage(message) {
    // await this.chatService.writeMessageData(message);
    // console.log('Message forwarded.');
  }

  sendForwardMessages() {
    this.clipboard.paste().then(
    (msgTxt: string) => {
      alert(msgTxt);
      if (msgTxt && this.msgForwardUserList) {
        // send messages to all users
        for (const key of this.getObjectKeys(this.msgForwardUserList)) {
          const user = this.msgForwardUserList[key];
          // set to 'TEXT'
          const messageType = 'TEXT';
          // create message object
          // messageId, chatId and timestamp to be left empty, will be set in chat.service.ts
          const message: Message = {
            // combine loggin userId with receiver user id array
            userIdSenderReceiverArray: [this.userLoggedIn.userId, ...this.userReceiver.userIdArray],
            userIdSender: this.userLoggedIn.userId, // userId of person sending message
            userIdReceiverArray: this.userReceiver.userIdArray, // person receiving message
            isRead: false,
            messageType, // messageType could be 'LOCATION', ‘TEXT’, ‘IMAGE’, ‘VIDEO’, ‘FILE’
          };

          // message type conditions 'LOCATION', ‘TEXT’, ‘IMAGE’, ‘VIDEO’, ‘FILE’ etc.
          if (messageType === 'TEXT') {
            // sending text message
            message.text = msgTxt;
          } else if (messageType === 'LOCATION') {
            // sending text message
            message.latitude = '';
            message.longitude = '';
          }
          // forward message
          this.sendForwardedMessage(message);
        }
        // show toast message sent
        this.utilityService.presentToast('Message sent', 'medium', 'middle', 1500, 'msg-copied-toast');
        // do clear all selected users for forwarding
        this.clearForwarding();
      }
    },
    (reject: string) => {
      alert('Error: ' + reject);
    });
  }

  async sendMessage(messageType, anyData?) {
    if (this.data.message) {
      // messageId, chatId and timestamp to be left empty, will be set in chat.service.ts
      const message: any = {
        // combine loggin userId with receiver user id array
        userIdSenderReceiverArray: [Number(this.userLoggedIn.userId), ...this.userReceiver.userIdArray],
        userIdSender: this.userLoggedIn.userId, // userId of person sending message
        userIdReceiverArray: this.userReceiver.userIdArray, // person receiving message
        isRead: false,
        messageType, // messageType could be 'LOCATION', ‘TEXT’, ‘IMAGE’, ‘VIDEO’, ‘FILE’
        userId: this.userLoggedIn.userId
      };

      // message type conditions 'LOCATION', ‘TEXT’, ‘IMAGE’, ‘VIDEO’, ‘FILE’ etc.
      if (messageType === 'TEXT') {
        // sending text message
        message.text = this.data.message;
      } else if (messageType === 'LOCATION') {
        // sending text message
        message.latitude = anyData.latitude;
        message.longitude = anyData.longitude;
      }

      const messageHeaderId = undefined;
      const userNamesObj = {};
      userNamesObj[this.userLoggedIn.userId] = this.userLoggedIn.userName ? this.userLoggedIn.userName : '';
      userNamesObj[this.userReceiver.userId] = this.userReceiver.userName ? this.userReceiver.userName : '';

      const profileImagePathObj = {};
      if (this.userLoggedIn.userId && this.userLoggedIn.profileImagePath)
        profileImagePathObj[this.userLoggedIn.userId] = this.userLoggedIn.profileImagePath;
      if (this.userReceiver.userId && this.userReceiver.profileImagePath)
        profileImagePathObj[this.userReceiver.userId] = this.userReceiver.profileImagePath;

      if (!this.messagesHeader || Object.keys(this.messagesHeader).length == 0) {
        this.messagesHeader = {
          id: messageHeaderId,
          groupName: '',
          lastMessage: message.text,
          userArr: message.userIdSenderReceiverArray,
          userNamesObj,
          profileImagePathObj,
          unreadUserId: this.userReceiver.userIdArray[0],
          userId: this.userLoggedIn.userId
        }
      }
      this.messagesHeader.lastMessage = message.text;

      await this.chatService.writeMessageData(message, this.messagesHeader);

      // if no messages - fetch messages
      if (!this.messages || this.messages.length == 0) {
        this.getMessages(this.messagesHeader.id);
      }
      // if no users - fetch users
      if (!this.users || this.users.length == 0) {
        this.getMessagesHeader();
      }
      // clear message input field
      this.data.message = '';
      // scrollToBottom
      // this.content.scrollToBottom(100);
      console.log('Message sent.');
    }
  }

  async getMessages(messagesHeaderId, limit?) {
    if (messagesHeaderId) {
      // clear loadMapList
      this.loadMapList = {};
      // load messages from database
      const messages: Observable<any[]> = await this.chatService.readMessageData(messagesHeaderId, limit);
      // since this messages is observable, pipe is required to get mapped values
      messages.pipe(
        map(changes =>
          changes.map(c =>
            // add key of an object to current object
            ({ key: c.payload.key, ...c.payload.val() })
          )
        )
      ).subscribe(data => {
        // console.log('messages', data);
        this.messages = data;
      });
    } else {
      this.messages = [];
    }
  }

  async markAsRead(message) {
    message.isRead = true;
    await this.chatService.updateMessageData(message);
  }

  async deleteMessageForMe(chatId, messageId) {
    // re-confirm from user - are you sure to delete message

      const userId = localStorage.getItem('userId');
      // pass userId, so that we can set isDeletedUserIdArray: {userId: true}
      // this way by setting true we will not display this message for this user
      await this.chatService.deleteMessageForMe(userId, chatId, messageId);
  }

  async messageActions(){
    const actionSheet = await this.actionSheetController.create({
      header: 'Select Attachments Source',
      buttons: [{
            text: 'Camera',
            handler: () => {
                
            }
        },
        {
            text: 'Gallery',
            handler: () => {
                
            }
        },
        {
            text: 'Document',
            handler: () => {
                
            }
        },
        {
          text: 'Location',
          handler: () => {
            this.shareLocation();
          }
        },
        {
          text: 'Contact',
          handler: () => {
              
          }
        },
        {
            text: 'Cancel',
            role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }

  shareLocation() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.data.message = 'Location';
      const data = {
        latitude: resp.coords.latitude,
        longitude: resp.coords.longitude
      }
      this.sendMessage('LOCATION', data);

     }).catch((error) => {
       console.log('Error getting location', error);
     });
  }

  getUsersOnlyLength() {
    let count = 0;
    for (const user of this.users) {
      if ((user.userId != this.userLoggedIn.userId) && (this.createNewGroupActive ?  (user.groupName ? false : true) : true)) {
        count++;
      }
    }
    return count;
  }

  async createGroup(step) {
    this.setUserToAddInGroup();
    // empty messagesHeader to create new messagesHeader for group
    this.messagesHeader = {};
    if (step === 1) {
      // show next screen where group name and icon will be asked
      this.createNewGroupActive = 1;
    } else if (step === 2) {
      // show next screen where group name and icon will be asked
      this.createNewGroupActive = 2;
    } else {
      // check group subject entered or not - its required before group creates
      if (!this.newGroupName) {
        // show toast when newGroupName is empty
        this.utilityService.presentToast('Group subject required', 'light', 'middle', 1500, 'msg-copied-toast');
        // focus on input field
        this.groupNameElement.setFocus();
      } else {
        const messageHeader = {
          id: undefined,
          groupName: this.newGroupName,
          lastMessage: '',
          userArr: [],
          unreadUserId: [],
          userNamesObj: {},
          profileImagePathObj: {}
        }
        // step forward to create group in database
        for (const key of Object.keys(this.pressedUserIdList)) {
          // const userId = this.pressedUserIdList[key];
          // create user array here to be pass in group create objct
          messageHeader.userArr.push(Number(key));
          messageHeader.unreadUserId.push(key);
          messageHeader.userNamesObj[key] = this.pressedUserIdList[key].userName;
          messageHeader.profileImagePathObj[key] = this.pressedUserIdList[key].profileImagePath;
        }
        // also add loggedin user in array
        messageHeader.userArr.push(Number(this.userLoggedIn.userId));
        messageHeader.userNamesObj[this.userLoggedIn.userId] = this.userLoggedIn.userName ? this.userLoggedIn.userName : '';
        messageHeader.profileImagePathObj[this.userLoggedIn.userId] = this.userLoggedIn.profileImagePath ? this.userLoggedIn.profileImagePath : '';
        // call a function to create group
        // await this.chatService.createGroup(group);
        await this.chatService.createUpdateMessageHeader(messageHeader);
        // remove background color
        for (const key of Object.keys(this.pressedUserElementList)) {
          const item = this.pressedUserElementList[key];
          item.setAttribute('style', '--background: none');
        }
        // show toast - new group created
        this.utilityService.presentToast('New group created: ' + this.newGroupName, 'medium', 'middle', 1500, 'msg-copied-toast');
        // reset group create screens
        this.newGroupName = undefined;
        this.createNewGroupActive = 0;
        this.pressedUserIdList = {};
        this.msgForwardUserList = {};
        this.pressedUserElementList = {};
        // load new list of MessagesHeader
        this.getMessagesHeader();
      }
    }
  }

  clearGroupCreate() {
    if (this.editGroupTo != '') {
      // step 9 means back button is pressed from user add screen
      // editGroupTo may have value 'add' or 'remove'
      this.editGroupTo = '';
      // setp 9 is for adding user in group
      this.createNewGroupActive = 0;
      this.addUserInGroupActive = false;
      this.showListOfMessages = true;
    } else {
      this.createNewGroupActive = 0;

      // remove background color from each clicked user to create group
      for (const key of Object.keys(this.pressedUserElementList)) {
        const item = this.pressedUserElementList[key];
        item.setAttribute('style', '--background: none');
      }
      // remove if already exist - means user has unselected user from selection
      this.pressedUserElementList = {};
      this.pressedUserIdList = {};
    }
  }

  setUserToAddInGroup() {
    this.usersToAddInGroup = this.users;
  }

  addUserInGroup() {
    // editGroupTo may have value 'add' or 'remove'
    this.editGroupTo = 'add';
    // setp 9 is for adding user in group
    this.createNewGroupActive = 9;
    this.setUserToAddInGroup();
    this.addUserInGroupActive = true;
    this.showListOfMessages = false;
  }

  async updateGroup() {
    if (this.editGroupTo == 'add') {
      // initialize array if this.userReceiver.userIdArray found undefined
      if (this.userReceiver.userIdArray == undefined) {
        this.userReceiver.userIdArray = [];
      }
      if (!this.messagesHeader.profileImagePathObj) {
        this.messagesHeader.profileImagePathObj = {};
      }
      // step forward to create group in database
      for (const key of Object.keys(this.pressedUserIdList)) {
        const userId = key;
        const user = this.pressedUserIdList[key];
        // create user array here to be pass in group create objct
        if (this.userReceiver.userIdArray.indexOf(userId) == -1)
          this.userReceiver.userIdArray.push(Number(userId));
        // add newly added users
        if (this.messagesHeader.userArr.indexOf(userId) == -1)
          this.messagesHeader.userArr.push(Number(userId));
        this.messagesHeader.userNamesObj[userId] = user.userName ? user.userName : '';
        this.messagesHeader.profileImagePathObj[userId] = user.profileImagePath;
      }
      // call a function to create group
      await this.chatService.createUpdateMessageHeader(this.messagesHeader);
      // show toast - new group created
      this.utilityService.presentToast('Group updated', 'medium', 'middle', 1500, 'msg-copied-toast');
      // reset group create screens
      this.newGroupName = undefined;
      this.pressedUserIdList = {};
      this.msgForwardUserList = {};
      // reset and display back messages screen of group
      this.editGroupTo = '';
      // setp 9 is for adding user in group
      this.createNewGroupActive = 0;
      this.addUserInGroupActive = false;
      this.showListOfMessages = true;
    }
  }

  checkUserContainsInGroup(userId) {
    // if index of userId found in clicked userIdArray
    // if index is greater than -1 means userfound then return true to indicate user already in group
    if (this.messagesHeader.userArr) {
      return !(this.messagesHeader.userArr.indexOf(String(userId)) > -1 || this.messagesHeader.userArr.indexOf(Number(userId)) > -1);
    } else {
      // if userIdArray not found means return false - no user in group
      return true;
    }
  }

  async groupInfoModal() {
    const users = [];
    // get all users object which are added in this group
    for (const userId of this.userReceiver.userIdArray) {
      const user = this.users.find(o => (o.userId == userId));
      if ((user.userId != this.userLoggedIn.userId) && (this.createNewGroupActive ?  (user.groupName ? false : true) : true)) {
        users.push(user);
      }
    }
    const modal = await this.modalController.create({
      component: GroupInfoModalPage,
      cssClass: '',
      componentProps: {
        users,
        messagesHeader: this.messagesHeader,
        userLoggedIn: this.userLoggedIn
      }
    });
    return await modal.present();
  }

  setUserId(messagesHeader) {
    // after removing current userId from userArr the remaining userId will be opponent userId
    const userId = messagesHeader.userArr.filter(id => id != this.userLoggedIn.userId)[0];
    if (userId && !messagesHeader.groupName) {
      // this userId will be opponenet user id
      messagesHeader.userId = userId;
      messagesHeader.userName = messagesHeader.userNamesObj[userId] ? messagesHeader.userNamesObj[userId] : '';
      messagesHeader.profileImagePath = messagesHeader.profileImagePathObj ? messagesHeader.profileImagePathObj[userId] : '';
    }
  }

  getUserIdsExceptCurrentUserId(messagesHeader) {
    if (messagesHeader.userArr) {
      return messagesHeader.userArr.filter(id => id != this.userLoggedIn.userId)[0];
    } else {
      return [];
    }
  }

  async getMessagesHeader() {
    this.users = await this.chatService.getMessagesHeader(this.userLoggedIn.userId);
  }

  getFriendsList() {
    // call an API
    this.chatService.getFriendsList()
    .subscribe((value: any) => {
      // check response
      if (value.responseState && value.data) {
        this.friendsList = value.data;

        // this.friendsList.forEach((value, index) => {
        //   // iterate friends list to get last message sent or received by user
        //   this.getLastMessage(index, value.userId);
        // });
      } else {
        console.log('Failed to call API');
      }
    }, (error) => {
      console.log('Api error');
      if(error.name == 'HttpErrorResponse')
        this.ccUtil.fail_modal('Please check your Network Connection');
      else
        this.ccUtil.fail_modal(error.message);
    });
  }
}
