import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CONSTANTS } from 'src/app/constants/constants';
// firebase imports
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Message } from '../interfaces/message';
import { User } from '../interfaces/user';
import { UtilityService } from './utility.service';
import firebase from 'firebase';
import { Group } from '../interfaces/group';
import { CcutilService } from 'src/app/services/ccutil.service';
import { MessageHeader } from '../interfaces/message-header';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  public headers = new HttpHeaders();

  constructor(public ccUtil: CcutilService, private angularFireDatabase: AngularFireDatabase, public httpClient: HttpClient, private firestore: AngularFirestore) { }

  // START: ALL UTILITY FUNCTIONS FOR CHAT MODULE

  getChatId(loggedInUserId, receiverUserId) {
    // For the easily fetch user conversation I have followed pattern (LowerUserId_HigherUserId).
    // For example, conversation between 109 and 108 is stored in the node 108_109.
    if (loggedInUserId > receiverUserId) {
      // followed the pattern LowerUserId_HigherUserId
      return receiverUserId + '_' + loggedInUserId;
    } else {
      // followed the pattern LowerUserId_HigherUserId
      return loggedInUserId + '_' + receiverUserId;
    }
  }
  // END: ALL UTILITY FUNCTIONS FOR CHAT MODULE

  // write to Firebase realtime database
  // async writeUserData(user: User) {
  //   return this.angularFireDatabase.object('users/' + user.id).set(user);
  // }

  // async readUsersData() {
  //   const users: Observable<any[]> = await this.angularFireDatabase.list('users').snapshotChanges();
  //   return users;
  // }

  // // using Message interface to declare type of variable messageObject
  // async createUpdateUser(user: User) {
  //   // set timestamp
  //   user.timestamp = firebase.database.ServerValue.TIMESTAMP;

  //   // create group node in firebase realtime database
  //   // adding groups also in users to fetch list of users and groups together
  //   return this.angularFireDatabase.object('users/' + user.userId).set(user);
  // }

  async getMessagesHeader(loggedInUserId) {
    // #1 create a Promise, remember to add 'async' keyword before a function when using 'Promise'
    const promise = new Promise((resolve, reject) => {
      let query;
      // order list match by uid
      query = this.firestore.collection('messagesHeader',
      (ref: firebase.firestore.CollectionReference | firebase.firestore.Query) => {
        ref = ref.where('userArr', 'array-contains', Number(loggedInUserId)).orderBy('timestamp', 'desc');
        return ref;
      });

      query.snapshotChanges().subscribe(data => {
        // this.categoryList stores list of products
        const messagesHeaderList = data.map(e => {
          return {
            id: e.payload.doc.id,
            ...e.payload.doc.data()
          } as any;
        });
        // #3 instead of using 'return or callback' we use 'resolve' in promises
        resolve(messagesHeaderList);
      });
    });
    // #2 add `await` keyword before a promise and return that promise
    return await promise;
  }

  //
  async createUpdateMessageHeader(messageHeader: MessageHeader) {
    // for new chat we need to create messageHeader id
    if (!messageHeader.id) {
      const ref = await this.firestore.collection('messagesHeader').add({});
      const messageHeaderId = ref.id;
      messageHeader.id = messageHeaderId;
    }
    // set timestamp
    messageHeader.timestamp = firebase.firestore.FieldValue.serverTimestamp();
    // increment msgUnreadObj value to show unread messages
    messageHeader.unreadCount = firebase.firestore.FieldValue.increment(1);

    // create group node in firebase realtime database
    // adding groups also in users to fetch list of users and groups together
    const promise = new Promise((resolve, reject) => {
      // add orderObject to OrderCollection
      this.firestore.collection('messagesHeader').doc(messageHeader.id).set(messageHeader)
      .then(() => {
        resolve(messageHeader.id);
      });
    });
    // #2 add `await` keyword before a promise and return that promise
    return await promise;
  }

  // write to Firebase realtime database
  // using Message interface to declare type of variable messageObject
  async writeMessageData(message: Message, messageHeader) {
    // 1. DO MESSAGE_HEADER SAVE
    let messageHeaderId: any;
    // create or update messages header with users and messages details
    messageHeaderId = await this.createUpdateMessageHeader(messageHeader);

    // 2. DO MESSAGE SAVE
    // push to get unique id and set it to messageId
    const messageId = await this.angularFireDatabase.createPushId();
    // set messageId, uniqely generated from firebase database
    message.messageId = messageId;

    // set chatId, chatId will be following the pattern LowerUserId_HigherUserId
    // FOR ONO-TO-ONE MESSAGE userIdReceiverArray WILL HAVE ONLY ONE USER_ID

    if (messageHeaderId) {
      // else fetch messages by chatId generated from LowerUserId_HigherUserId
      // message.chatId = this.getChatId(message.userIdSender, message.userIdReceiverArray[0]);
      message.chatId = messageHeaderId;
    } else if (message.groupId) {
      // if clicked element is group means user.groupId found then chatId will be groupId
      message.chatId = message.groupId;
    }

    // set timestamp
    message.timestamp = firebase.database.ServerValue.TIMESTAMP;

    return this.angularFireDatabase.object('messages/' + message.chatId + '/' + message.messageId).set(message);
  }

  async updateMessageData(message: Message) {
    return this.angularFireDatabase.object('messages/' + message.chatId + '/' + message.messageId).update(message);
  }

  async deleteMessageForMe(userId, chatId, messageId) {
    return this.angularFireDatabase.object('messages/' + chatId + '/' + messageId + '/isDeletedUserIds/' + userId).set(true);
  }

  // chatId will be following the pattern LowerUserId_HigherUserId
  async readMessageData(messagesHeaderId, limit?) {
    const messages: Observable<any[]> = await this.angularFireDatabase.list('messages/' + messagesHeaderId, (ref) => {
      if (limit) {
        return ref.limitToLast(limit);
      } else {
        return ref;
      }
    }).snapshotChanges();
    return messages;
  }

  // async countUnreadMessages(chatId) {
  //   const messages: Observable<any[]> = await this.angularFireDatabase.list('messages/' + chatId, (ref) => {
  //     return ref.orderByChild('isRead').equalTo(false)
  //   }).snapshotChanges();
  //   return messages;
  // }

  // chatSyncOnlineUsers(userId) {
  //   // In connections node we can store each active device connection detail
  //   // since I can connect from multiple devices or browser tabs, we store each connection instance separately
  //   // any time that connectionsRef's value is null (i.e. has no children) I am offline
  //   // more info: https://firebase.google.com/docs/database/web/offline-capabilities
  //   const myConnectionsRef = firebase.database().ref('users/' + userId + '/connections');

  //   // stores the timestamp of my last disconnect (the last time I was seen online)
  //   const lastOnlineRef = firebase.database().ref('users/' + userId + '/lastOnline');

  //   const connectedRef = firebase.database().ref('.info/connected');
  //   connectedRef.on('value', (snap) => {
  //     if (snap.val() === true) {
  //       // We're connected (or reconnected)! Do anything here that should happen only if online (or on reconnect)
  //       const con = myConnectionsRef.push();

  //       // When I disconnect, remove this device
  //       con.onDisconnect().remove();

  //       // Add this device to my connections list
  //       // this value could contain info about the device or a timestamp too
  //       con.set(true);

  //       // When I disconnect, update the last time I was seen online
  //       lastOnlineRef.onDisconnect().set(firebase.database.ServerValue.TIMESTAMP);
  //     }
  //   });
  // }

  // START: GROUP RELATED FUNCTIONS

  // create new group
  // async createGroup(group: Group) {
  //   // push to get unique id and set it to groupId
  //   const groupId = await this.angularFireDatabase.createPushId();
  //   // set groupId, uniqely generated from firebase database
  //   // groupId will be following the pattern GROUP_UNIQUE_ID
  //   group.groupId = groupId;
  //   group.id = groupId;

  //   // set timestamp
  //   group.timestamp = firebase.database.ServerValue.TIMESTAMP;

  //   // create group node in firebase realtime database
  //   // adding groups also in users to fetch list of users and groups together
  //   return this.angularFireDatabase.object('users/' + group.groupId).set(group);
  // }

  // // update group - adding or removing users in/from group
  // async updateGroup(object) {
  //   // set timestamp
  //   object.timestampUpdate = firebase.database.ServerValue.TIMESTAMP;

  //   // update group node in firebase realtime database
  //   // adding groups also in users to fetch list of users and groups together
  //   return this.angularFireDatabase.object('users/' + object.groupId).update(object);
  // }

  // END: GROUP RELATED FUNCTIONS

  // APIs to access Backend Database
  getFriendsList() {
    return this.httpClient.get(CONSTANTS.API_ENDPOINT + 'CCAPI/user/getFriendsList?X-Auth-Token=' + localStorage.getItem('X-Auth-Token'));
  }

  addFriend(friendUserId) {
    return this.httpClient.get(CONSTANTS.API_ENDPOINT + 'CCAPI/user/addFriend?X-Auth-Token=' + localStorage.getItem('X-Auth-Token') + '&friendUserId=' + friendUserId);
  }

  updateUserStatus(status) {
    return this.httpClient.get(CONSTANTS.API_ENDPOINT + 'CCAPI/user/updateUserStatus?X-Auth-Token=' + localStorage.getItem('X-Auth-Token') + '&status=' + status);
  }

  callUpdateUserStatus(status) {
    // call an API
    this.updateUserStatus(status)
    .subscribe((value: any) => {
      // check response
      if (value.responseState && value.data) {
        console.log('Update User Login/Logout Status', value.data);
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
