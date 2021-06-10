import { Component, OnInit, ViewChild } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { AlertController, IonSlides } from '@ionic/angular';
import { CcutilService } from 'src/app/services/ccutil.service';
import { ScoringService } from '../services/scoring.service';
import { ActionSheetController } from '@ionic/angular';
import { VideoStreamService } from '../services/video-stream.service';

@Component({
  selector: 'app-live-streaming-list',
  templateUrl: './live-streaming-list.page.html',
  styleUrls: ['./live-streaming-list.page.scss'],
})
export class LiveStreamingListPage implements OnInit {

  @ViewChild('slides', { static: true }) slider: IonSlides;
  // @ViewChild(IonContent, { static: false }) ionContent: IonContent;

  public currentSegmentName = 0;

  loadingSpinner: any;
  matchesObject: any = {};
  channel = false;
  selectLeaguesClubId: any;
  myLeagues: any;
  errorMessage: string = '';

  constructor(private scoringService: ScoringService, private videoStreamService: VideoStreamService, public ccUtil: CcutilService, private router: Router, public actionSheetController: ActionSheetController, private alertController: AlertController) {
    // fetch matches list to be shown in Ready To Stream tab - tab2
    this.getMyLeagues();
  }

  ngOnInit() {
  }

  async segmentChanged() {
    await this.slider.slideTo(this.currentSegmentName);

    const sliderIndex = await this.slider.getActiveIndex();
    if(sliderIndex === 0){
      
    }else if(sliderIndex === 1){
      
    }else if(sliderIndex === 2){
      
    }
  }

  doRefresh(event) {
    // on page reload by pull to refresh
    this.getLiveStreamScheduleMatches(() => {
      event.target.complete();
    });
  }

  async slideChanged(){
    this.currentSegmentName = await this.slider.getActiveIndex();
  }

  getMyLeagues() {
    this.myLeagues = [];
    // call an API 
    this.scoringService.getMyLeagues()
    .subscribe((value: any) => {
      // check response
      if (value.responseState && value.data) {
        this.myLeagues = value.data;
        // this change will call showSelectLeague() because of ionChange() in select elem.
        if (this.myLeagues[0]) {
          this.selectLeaguesClubId = this.myLeagues[0].clubId;
        }
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

  showSelectLeague() {
    // initially gets called itself because we are setting the value of selectLeaguesClubId changed from nothing to clubId in getMyLeagues().
    // when user change league
    this.getLiveStreamScheduleMatches();
  }

  getLiveStreamScheduleMatches(callback?) {
    this.matchesObject = [];
    this.errorMessage = '';
    // show loader
    this.loadingSpinner = true;
    // call an API
    this.scoringService.getLiveStreamScheduleMatches(this.selectLeaguesClubId)
    .subscribe((value: any) => {
      if (callback) {
        callback();
      }
      // hide loader
      this.loadingSpinner = false;
      // check response
      if (value.responseState && value.data) {
        // get match details
        this.matchesObject = value.data;
      } else {
        console.log('Failed to call API');
        if(value.errorMessage){
          this.errorMessage = value.errorMessage;
        }
      }
    }, (error) => {
      // hide loader
      this.loadingSpinner = false;
      console.log('Api error');
      if(error.name == 'HttpErrorResponse')
        this.ccUtil.fail_modal('Please check your Network Connection');
      else
        this.ccUtil.fail_modal(error.message);
    });
  }

  navigateToLiveStreamVideoPage(match) {
    if (this.selectLeaguesClubId) {
      // get channel value from toggle button
      match.channel = this.channel ? 'production' : 'test';
      match.clubId = this.selectLeaguesClubId;
      const navigationExtras: NavigationExtras = {
        state: {
          match
        }
      };
      this.router.navigate(['/start-streaming'], navigationExtras);
    } else {
      this.ccUtil.presentToast('Select League. Not getting ClubId.');
    }
  }

  // this event handler triggered from app-match-list component page
  async onCardClick($event) {
    // console.log('$event', $event);
    const actionSheet = await this.actionSheetController.create({
      // header: 'Select',
      cssClass: '',
      buttons: [{
        text: 'Stream from Phone',
        icon: 'videocam',
        handler: () => {
          // open stream page if Stream from Phone selected
          this.navigateToLiveStreamVideoPage($event.match);
        }
      },
      {
        text: 'Stream from CricStreamer',
        icon: 'camera',
        handler: () => {
          // send device id to the API
          this.streamFromCricStreamer($event.match);
        }
      },
      {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }

  async streamFromCricStreamer(match) {
    // check if already found in local storage
    const cricStreamerDeviceId = localStorage.getItem('cricStreamerDeviceId');
    const changeTargetAlert = await this.alertController.create({
      header: 'Change Target',
      backdropDismiss: false,
      inputs: [
        {
          name: 'deviceId',
          type: 'text',
          placeholder: '*Enter Device Id',
          value: cricStreamerDeviceId ? cricStreamerDeviceId : ''
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler:() => {
          }
        },
        {
          text: 'Save',
          handler: data => {
            if (data.deviceId == "") {
              this.ccUtil.presentToast('Please enter Device Id');
              return false;
            } else {
              // store deviceId in local storage
              localStorage.setItem('cricStreamerDeviceId', data.deviceId);
              this.getLiveStreamDetails(match, data.deviceId);
            }
          }
        }
      ]
    });
    await changeTargetAlert.present();
  }

  getLiveStreamDetails(match, deviceId) {
    match.clubId = this.selectLeaguesClubId;
    // call an API
    this.videoStreamService.getLiveStreamDetails(match, deviceId)
    .subscribe((value: any) => {
      this.loadingSpinner = false;
      // check response
      if (value.responseState && value.data) {
        this.ccUtil.messageAlert('', 'Saved Successfully');
        // if (!this.liveStreamDetails) {
        //   this.liveStreamDetails = {};
        // }
        // // get live stream details
        // this.liveStreamDetails = value.data;

        // if (!this.liveStreamDetails.streamKey && this.liveStreamDetails.key) {
        //   this.liveStreamDetails.streamKey = this.liveStreamDetails.key;
        // }

        // // start streaming now
        // this.startStreaming();
      } else {
        this.loadingSpinner = false;
        console.log('Failed to call API');
      }
    }, (error) => {
      // hide loader
      this.loadingSpinner = false;
      console.log('Api error');
      if(error.name == 'HttpErrorResponse')
        this.ccUtil.fail_modal('Please check your Network Connection');
      else
        this.ccUtil.fail_modal(error.message);
    });
  }

}
