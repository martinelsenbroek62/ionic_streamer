import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, IonSlides } from '@ionic/angular';
import { CcutilService } from 'src/app/services/ccutil.service';
import { ScorecardService } from '../services/scorecard.service';

@Component({
  selector: 'app-scorecard',
  templateUrl: './scorecard.page.html',
  styleUrls: ['./scorecard.page.scss'],
})
export class ScorecardPage implements OnInit {
  @ViewChild(IonContent, { static: false }) content: IonContent;
  @ViewChild('slides', { static: true }) slider: IonSlides;

  public currentSegmentName = 0;

  scoringEndMatch = false;
  matchData: any;
  matchInfo: any;
  scorecard: any;
  matchInfoHeaders: any;
  previousEncounters: any;
  matchResultsAtGround: any;
  playersToWatch: any;
  ballByBall: any;
  recentForms: any;

  errorMessage = '';
  loadingSpinner = false;

  match = {"clubId":50,"clubName":"Live Scoring Preparation Camp","matchId":622,"matchDate":"11/26/2020","matchDateFormated":"Nov-26-2020","day":"Thursday","isComplete":0,"overs":20,"winner":0,"teamOne":217,"teamOneName":"India","teamTwo":206,"teamTwoName":"Blackcaps","t1_logo_file_path":"/documentsRep/teamLogos/india.jpg","t2_logo_file_path":"/documentsRep/teamLogos/80287e2e-59dc-4f43-82c1-3c859e2a886c.jpg","isFollowon":0,"seriesType":"Twenty20","timeSinceLastUpdate":"14 days ago.","matchType":"l","result":"India: 0/0(0.0/20 ov)  ","liveStreamLink":"","t1total":0,"t2total":0,"t1balls":0,"t2balls":0,"t1wickets":0,"t2wickets":0,"t1_1total":0,"t2_1total":0,"t1_1balls":0,"t2_1balls":0,"t1_1wickets":0,"t2_1wickets":0,"t1_2total":0,"t2_2total":0,"t1_2balls":0,"t2_2balls":0,"t1_2wickets":0,"t2_2wickets":0};

  constructor(public ccUtil: CcutilService, private router: Router, private scorecardService: ScorecardService) {
    if (this.router.getCurrentNavigation().extras.state) {
      this.scoringEndMatch = this.router.getCurrentNavigation().extras.state.scoringEndMatch;
      this.matchData = this.router.getCurrentNavigation().extras.state.matchData;
      console.log('this.matchData', this.matchData);
    }
  }

  ngOnInit() {
    // segment 1
    this.getScoreCard();
    this.getMatchInfoHeaders(() => {
      // if match completed active tab will be Live tab else Info tab by default
      if (this.matchInfoHeaders.isComplete) {
        this.currentSegmentName = 1;
      }
    });
    this.getMatchInfo();
    this.getPlayersToWatch();
    this.getMatchResultsAtGround();
    this.getPreviousEncounters();
    this.getRecentForms();
    // segment 2
    this.getBallByBall();

    this.getChartDataSets();
  }

  async slideChanged(){
    this.currentSegmentName = await this.slider.getActiveIndex();
  }

  async segmentChanged() {
    await this.slider.slideTo(this.currentSegmentName);
    const sliderIndex = await this.slider.getActiveIndex();
    if(sliderIndex === 0) {
      this.getScoreCard();
      this.getMatchInfoHeaders();
      this.getMatchInfo();
      this.getPlayersToWatch();
      this.getMatchResultsAtGround();
      this.getPreviousEncounters();
      this.getRecentForms();
    }
    else if(sliderIndex === 1) {
      this.getBallByBall();
    }
    else if(sliderIndex === 2) {
      // this.getStats();
    }
    else if(sliderIndex === 3) {
      // this.getChart();
    }
    else if(sliderIndex === 4) {
      // this.getImages();
    }

    // do scroll to top - if in case user scrolled to down and changed tab
    this.scrollToTop();
  }

  doRefresh(event) {
    // segment 1
    this.getScoreCard();
    this.getMatchInfoHeaders();
    this.getMatchInfo();
    this.getPlayersToWatch();
    this.getMatchResultsAtGround();
    this.getPreviousEncounters();
    this.getRecentForms();
    // segment 2
    this.getBallByBall();

    this.getChartDataSets();
    // hide loading spinner after 5 sec.
    setTimeout(() => {
      event.target.complete();
    }, 5000);

    // do scroll to top - if in case user scrolled to down and changed tab
    this.scrollToTop();
  }

  scrollToTop() {
    this.content.scrollToTop(0);
  }

  getBallByBall() {
    // send data to server
    this.errorMessage = '';
    // show loader
    this.loadingSpinner = true;
    // call an API
    this.scorecardService.getBallByBall(this.matchData.clubId, this.matchData.matchId)
    .subscribe((value: any) => {
      // hide loader
      this.loadingSpinner = false;
      // check response
      if (value.responseState && value.data) {
        console.log('getBallByBall value', value.data);
        this.ballByBall = value.data;
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

  getPlayersToWatch() {
    // send data to server
    this.errorMessage = '';
    // show loader
    this.loadingSpinner = true;
    // call an API
    this.scorecardService.getPlayersToWatch(this.matchData.clubId, this.matchData.fixtureId, 2)
    .subscribe((value: any) => {
      // hide loader
      this.loadingSpinner = false;
      // check response
      if (value.responseState && value.data) {
        console.log('getPlayersToWatch value', value.data);
        this.playersToWatch = value.data;
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

  getMatchResultsAtGround() {
    // send data to server
    this.errorMessage = '';
    // show loader
    this.loadingSpinner = true;
    // call an API
    this.scorecardService.getMatchResultsAtGround(this.matchData.clubId, this.matchData.fixtureId)
    .subscribe((value: any) => {
      // hide loader
      this.loadingSpinner = false;
      // check response
      if (value.responseState && value.data) {
        console.log('getMatchResultsAtGround value', value.data);
        this.matchResultsAtGround = value.data;
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

  getRecentForms() {
    // send data to server
    this.errorMessage = '';
    // show loader
    this.loadingSpinner = true;
    // call an API
    this.scorecardService.recentForms(this.matchData.clubId, this.matchData.fixtureId, 10)
    .subscribe((value: any) => {
      // hide loader
      this.loadingSpinner = false;
      // check response
      if (value.responseState && value.data) {
        console.log('recentForms value', value.data);
        this.recentForms = value.data;
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

  getPreviousEncounters() {
    // send data to server
    this.errorMessage = '';
    // show loader
    this.loadingSpinner = true;
    // call an API
    this.scorecardService.previousEncounters(this.matchData.clubId, this.matchData.fixtureId)
    .subscribe((value: any) => {
      // hide loader
      this.loadingSpinner = false;
      // check response
      if (value.responseState && value.data) {
        console.log('previousEncounters value', value.data);
        this.previousEncounters = value.data;
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

  getMatchInfo() {
    // send data to server
    this.errorMessage = '';
    // show loader
    this.loadingSpinner = true;
    // call an API
    this.scorecardService.getMatchInfo(this.matchData.clubId, this.matchData.matchId)
    .subscribe((value: any) => {
      // hide loader
      this.loadingSpinner = false;
      // check response
      if (value.responseState && value.data) {
        console.log('getMatchInfo value', value.data);
        this.matchInfo = value.data;
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

  getMatchInfoHeaders(callback?) {
    // send data to server
    this.errorMessage = '';
    // show loader
    this.loadingSpinner = true;
    // call an API
    this.scorecardService.getMatchInfoHeaders(this.matchData.clubId, this.matchData.matchId)
    .subscribe((value: any) => {
      // hide loader
      this.loadingSpinner = false;
      // check response
      if (value.responseState && value.data) {
        console.log('getMatchInfoHeaders value', value.data);
        this.matchInfoHeaders = value.data;
        if (callback) {
          callback();
        }
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

  getChartDataSets() {
    // send data to server
    this.errorMessage = '';
    // show loader
    this.loadingSpinner = true;
    // call an API
    this.scorecardService.getChartDataSets(this.matchData.clubId, this.matchData.matchId)
    .subscribe((value: any) => {
      // hide loader
      this.loadingSpinner = false;
      // check response
      if (value.responseState && value.data) {
        console.log('getChartDataSets value', value.data);
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

  getScoreCard() {
    // send data to server
    this.errorMessage = '';
    // show loader
    this.loadingSpinner = true;
    // call an API
    this.scorecardService.getScoreCard(this.matchData.clubId, this.matchData.matchId)
    .subscribe((value: any) => {
      // hide loader
      this.loadingSpinner = false;
      // check response
      if (value.responseState && value.data) {
        console.log('getScoreCard value', value.data);
        this.scorecard = value.data;
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

}
