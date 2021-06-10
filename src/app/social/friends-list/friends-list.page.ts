import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-friends-list',
  templateUrl: './friends-list.page.html',
  styleUrls: ['./friends-list.page.scss'],
})
export class FriendsListPage implements OnInit {
  searchFilterTerm: string;
  friendsList: any;
  taggedFriendsList: any = [];

  constructor(public modalController: ModalController) { }

  ngOnInit() {
    this.friendsList = [{id: 0, name: 'Mahendra Singh Dhoni'}, {id:1, name: 'Prasad'}, {id:2, name: 'John'}, {id:3, name: 'Sam Sundar'}];
  }

  dismiss(){
    this.modalController.dismiss({
      dismissed: true
    });
  }

  removeTag(taggedFriend){
    const index = this.taggedFriendsList.indexOf(taggedFriend.id);
    this.taggedFriendsList.splice(index, 1);
  }

  tagFriends(friend){
    const index = this.taggedFriendsList.indexOf(friend.id);
    // if(index != -1)
      this.taggedFriendsList.push(friend);
  }

}
