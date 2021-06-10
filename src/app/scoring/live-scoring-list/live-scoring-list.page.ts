import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, ModalController, NavController } from '@ionic/angular';
import { CcutilService } from 'src/app/services/ccutil.service';
import { ScoringService } from '../services/scoring.service';
import { NavigationExtras, Router } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';
import { CreateMatchPage } from '../create-match/create-match.page';
import { ScoringPage } from '../scoring/scoring.page';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-live-scoring-list',
  templateUrl: './live-scoring-list.page.html',
  styleUrls: ['./live-scoring-list.page.scss'],
})
export class LiveScoringListPage implements OnInit {

  @ViewChild('slides', { static: true }) slider: IonSlides;
  // @ViewChild(IonContent, { static: false }) ionContent: IonContent;

  public currentSegmentName = 0;

  loadingSpinner: any;
  matchesObject: any = {};
  LeagueData: any;
  selectLeaguesDropdown: any;
  myLeagues: any;
  errorMessage = '';

  constructor(private scoringService: ScoringService, public ccUtil: CcutilService, private router: Router, private actionSheetController: ActionSheetController, public modalController: ModalController, private navCtrl:NavController) {
    // fetch matches list to be shown in Ready To Stream tab - tab2
    this.getMyLeagues();
  }

  ngOnInit() {
  }

  async segmentChanged() {
    await this.slider.slideTo(this.currentSegmentName);

    const sliderIndex = await this.slider.getActiveIndex();
    if(sliderIndex === 0){
      
    }
    else if(sliderIndex === 1){
      
    }
    else if(sliderIndex === 2){
      
    }
  }

  doRefresh(event) {
    // on page reload by pull to refresh
    this.getLiveScoringScheduleMatches(() => {
      event.target.complete();
    });
  }

  async slideChanged(){
    this.currentSegmentName = await this.slider.getActiveIndex();
  }

  showSelectLeague() {
    // initially gets called itself because we are setting the value of selectLeaguesClubId changed from nothing to clubId in getMyLeagues().
    // when user change league
    this.getLiveScoringScheduleMatches();
  }

  getMyLeagues() {
    this.myLeagues = [];
    // call an API '1190306'
    this.scoringService.getMyLeagues()
    .subscribe((value: any) => {
      // check response
      if (value.responseState && value.data) {
        this.myLeagues = value.data;
        // this change will call showSelectLeague() because of ionChange() in select elem.
        if (this.myLeagues[0]) {
          this.selectLeaguesDropdown = this.myLeagues[0].clubId;
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

  getLiveScoringScheduleMatches(callback?) {
    this.matchesObject = [];
    this.errorMessage = '';
    // show loader
    this.loadingSpinner = true;
    // call an API
    this.scoringService.getLiveScoringScheduleMatches(this.selectLeaguesDropdown)
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
      if(error.name === 'HttpErrorResponse')
        this.ccUtil.fail_modal('Please check your Network Connection');
      else
        this.ccUtil.fail_modal(error.message);
    });
  }

  // this event handler triggered from app-match-list component page
  async onCardClick(event) {
    console.log('$event', event);
    let buttonsList = [];

    // if block is for ready to start only
    if (event.tabType === 'matchesReadyToStart') {
      buttonsList = [
        {
          text: 'Start Live Scoring',
          // icon: 'images',
          handler: () => {
            // redirect to create match page to create new match
            this.redirectToCreateMatchPage(event.match);
          }
        },
        {
          text: 'Update Match Summary',
          // icon: 'easel',
          handler: () => {
            // share scorecard
          }
        },
        {
          text: 'Cancel',
          // icon: 'close-circle',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
        }
      }];
    } else {
      // else block is for my matches and other in progress
      buttonsList = [
        {
          text: 'Continue Scoring',
          // icon: 'images',
          handler: () => {
            // redirect to scoring page and pass match object
            this.redirectToScoringPage(event.match);
          }
        },
        {
          text: 'Change Scorer',
          // icon: 'person-add',
          handler: () => {
            // open modal with friends list
          }
        },
        {
          text: 'Update Match Summary',
          // icon: 'easel',
          handler: () => {
            // share scorecard
          }
        },
        {
          text: 'Scorecard',
          // icon: 'person-add',
          handler: () => {
            // Redirect to scorecard page
            this.router.navigate(['/scorecard'], { state: { matchData: event.match } });
          }
        },
        {
          text: 'Overlay Controls',
          // icon: 'person-add',
          handler: () => {
            // open modal with friends list
          }
        },
        {
          text: 'Cancel',
          // icon: 'close-circle',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
        }
      }];
    }

    const actionSheet = await this.actionSheetController.create({
      // header: 'Select',
      cssClass: '',
      buttons: buttonsList
    });
    await actionSheet.present();
  }

  async redirectToCreateMatchPage(match: any) {
    /* open CreateMatchPage in modal to get data back to this page when modal closed */
    // set club id as well
    match.clubId = this.selectLeaguesDropdown;
    const modal = await this.modalController.create({
      component: CreateMatchPage,
      cssClass: '',
      componentProps: {
        matchData: match
      }
    });
    await modal.present();

    const resp: any = await modal.onDidDismiss();
    if (resp && resp.data && resp.data.reload) {
      // set default tab as My Games
      this.currentSegmentName = 0;
      // if params gets reload true then reload match data list
      this.getLiveScoringScheduleMatches();
    }
  }

  endScorerSessionCalled() {
    // reload data after scoring ends
    this.getLiveScoringScheduleMatches();
  }

  async redirectToScoringPage(match: any) {
    // Create a new subscriber
    this.scoringService.endScorerSessionSubscriber = this.scoringService.observableEndScorerSession.subscribe(( data ) => {
      this.endScorerSessionCalled();
      // do unsubscribe
      this.scoringService.endScorerSessionSubscriber.unsubscribe();
    });
    // set club id as well
    match.clubId = this.selectLeaguesDropdown;
    const navigationExtras: NavigationExtras = {
      state: {
        match
      }
    };
    // pass match details to create match page
    this.router.navigate(['/scoring'], navigationExtras);

    // // set club id as well
    // match.clubId = this.selectLeaguesDropdown;
    // const modal = await this.modalController.create({
    //   component: ScoringPage,
    //   cssClass: '',
    //   componentProps: {
    //     matchData: match
    //   }
    // });
    // await modal.present();

    // const resp: any = await modal.onDidDismiss();
    // if (resp && resp.data && resp.data.reload) {
    //   // set default tab as My Games
    //   this.currentSegmentName = 0;
    //   // if params gets reload true then reload match data list
    //   this.getLiveScoringScheduleMatches();
    // }
  }
}
