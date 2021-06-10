import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-notification-actions',
  templateUrl: './notification-actions.component.html',
  styleUrls: ['./notification-actions.component.scss'],
})
export class NotificationActionsComponent implements OnInit {

  constructor(private popoverCtrl: PopoverController) { }

  ngOnInit() {}

  async notificationAction(action){
    await this.popoverCtrl.dismiss({data: action});
  }

}
