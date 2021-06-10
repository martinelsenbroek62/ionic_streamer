import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { CcutilService } from 'src/app/services/ccutil.service';
import { NotificationActionsComponent } from '../components/notification-actions/notification-actions.component';
import { LeagueService } from '../services/league.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {

  errorMessage: string = ''; 
  loadingSpinner: any;
  notificationList: any = [];

  constructor(public ccUtil: CcutilService, private leagueApi: LeagueService, 
    private popoverCtrl: PopoverController) { }

  ngOnInit() {
    this.getNotificationList();
  }

  doRefresh(event) {
    this.getNotificationList();
    // hide loading spinner after 3 sec.
    setTimeout(() => {
      event.target.complete();
    }, 3000);
  }

  getNotificationList() {
    this.errorMessage = '';
    // show loader
    this.loadingSpinner = true;
    // call an API
    this.leagueApi.getNotificationList()
    .subscribe((value: any) => {
      // hide loader
      this.loadingSpinner = false;
      // check response
      if (value.responseState && value.data) {
        this.notificationList = value.data;
      } else {
        if(value.errorMessage){
          this.errorMessage = value.errorMessage;
        }
        console.log('Failed to call API');
      }
    }, (error) => {
      this.loadingSpinner = false;
      console.log('Api error');
      if(error.name == 'HttpErrorResponse')
        this.ccUtil.fail_modal('Please check your Network Connection');
      else
        this.ccUtil.fail_modal(error.message);
    });
  }

  updateNotification(action, notificationId){
    this.errorMessage = '';
    // show loader
    this.loadingSpinner = true;
    // call an API
    this.leagueApi.updateNotification(action, notificationId)
    .subscribe((value: any) => {
      // hide loader
      this.loadingSpinner = false;
      // check response
      if (value.responseState && value.data) {
        this.getNotificationList();
      } else {
        if(value.errorMessage){
          this.errorMessage = value.errorMessage;
        }
        console.log('Failed to call API');
      }
    }, (error) => {
      this.loadingSpinner = false;
      console.log('Api error');
      if(error.name == 'HttpErrorResponse')
        this.ccUtil.fail_modal('Please check your Network Connection');
      else
        this.ccUtil.fail_modal(error.message);
    });
  }

  async showNotificationActions() {
    const popover = await this.popoverCtrl.create({
      component: NotificationActionsComponent,
      cssClass: 'my-custom-class',
      // event: ev.event,
      // componentProps: {postId: ev.postId},
      translucent: true
    });

    popover.onDidDismiss().then((data) => {
      if(data.data.data == 'readAll') {
        this.updateNotification('read', 0);
      } else if(data.data.data == 'clearAll') {
        this.updateNotification('clear', 0);
      }
    });
    
    return await popover.present();
  }

}
