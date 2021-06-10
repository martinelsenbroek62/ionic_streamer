import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ChatService } from '../services/chat.service';
import { UtilityService } from '../services/utility.service';

@Component({
  selector: 'app-group-info-modal',
  templateUrl: './group-info-modal.page.html',
  styleUrls: ['./group-info-modal.page.scss'],
})
export class GroupInfoModalPage implements OnInit {

  // Data passed in by componentProps
  // users which are already in the group
  @Input() users: any;
  // userReceiver is a user or a group to which we do chat
  @Input() messagesHeader: any;
  @Input() userLoggedIn: any;

  searchFilterTerm: string;

  constructor(private utilityService: UtilityService, public modalController: ModalController, private chatService: ChatService) { }

  ngOnInit() {
  }

  getDateString(timestamp) {
    return timestamp? this.utilityService.getDateString(timestamp).date : '';
  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      dismissed: true
    });
  }

  async removeUserFromGroup(event, userId) {
    // remove userId from array and update in database
    const index = this.messagesHeader.userArr.indexOf(userId);
    this.messagesHeader.userArr.splice(index, 1);

    // call a function to update group
    await this.chatService.createUpdateMessageHeader(this.messagesHeader);

    // remove user card element from UI
    const target: any = event.target;
    // get pressed element
    const userElem = target.closest('.user-wrap');
    userElem.remove();
  }

}
