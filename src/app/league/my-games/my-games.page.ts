import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonSlides } from '@ionic/angular';
import { CcutilService } from 'src/app/services/ccutil.service';
import { LeagueService } from '../services/league.service';

@Component({
  selector: 'app-my-games',
  templateUrl: './my-games.page.html',
  styleUrls: ['./my-games.page.scss'],
})
export class MyGamesPage implements OnInit {
  @ViewChild('slides', { static: true }) slider: IonSlides;

  public currentSegmentName = 0;
  myLeagues: any = [];
  myGames: any = [];
  mySchedule: any = [];
  loadingSpinner: any;
  errorMessage = '';

  constructor(private leagueService: LeagueService, public ccUtil: CcutilService, 
    private router: Router) { }

  ngOnInit() {
    this.getMyLeagues();
  }

  async segmentChanged() {
    await this.slider.slideTo(this.currentSegmentName);

    const sliderIndex = await this.slider.getActiveIndex();
    if(sliderIndex === 0) {
      this.getMyLeagues();
    }
    else if(sliderIndex === 1) {
      this.getMyGames();
    }
    else if(sliderIndex === 2) {
      this.getMySchedule();
    }
  }

  doRefresh(event) {
    if(this.currentSegmentName === 0) {
      this.getMyLeagues(() => {
        event.target.complete();
      });
    } else if(this.currentSegmentName === 1) {
      this.getMyGames(() => {
        event.target.complete();
      });
    } else if(this.currentSegmentName === 2) {
      this.getMySchedule(() => {
        event.target.complete();
      });
    }
  }

  async slideChanged(){
    this.currentSegmentName = await this.slider.getActiveIndex();
  }

  goToLeaguePage(league){
    this.router.navigate(['/club-overview'], { state: { data: league} });
  }

  goToScorecardPage(match) {
    // Redirect to scorecard page
    this.router.navigate(['/scorecard'], { state: { matchData: match} });
  }

  onCardClick(event: any) {
    this.goToScorecardPage(event.match);
  }

  getMyLeagues(callback?) {
    this.myLeagues = [];
    this.errorMessage = '';
    // show loader
    this.loadingSpinner = true;
    // call an API
    this.leagueService.getMyLeagues()
    .subscribe((value: any) => {
      if (callback) {
        callback();
      }
      // hide loader
      this.loadingSpinner = false;
      // check response
      if (value.responseState && value.data) {
        this.myLeagues = value.data;
        if (this.myLeagues.length <= 0)
          this.errorMessage = 'No Leagues to show at this moment';
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

  getMyGames(callback?) {
    this.myGames = [];
    this.errorMessage = '';
    // show loader
    this.loadingSpinner = true;
    // call an API
    this.leagueService.getMyGames()
    .subscribe((value: any) => {
      if (callback) {
        callback();
      }
      // hide loader
      this.loadingSpinner = false;
      // check response
      if (value.responseState && value.data) {
        this.myGames = value.data;
        if(this.myGames.length <= 0)
          this.errorMessage = "No Matches to show at this moment";
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

  getMySchedule(callback?) {
    this.mySchedule = [];
    this.errorMessage = '';
    // show loader
    this.loadingSpinner = true;
    // call an API
    this.leagueService.getMySchedule()
    .subscribe((value: any) => {
      if (callback) {
        callback();
      }
      // hide loader
      this.loadingSpinner = false;
      // check response
      if (value.responseState && value.data) {
        this.mySchedule = value.data;
        if(this.mySchedule.length <= 0)
          this.errorMessage = 'No Fixtures to show at this moment';
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

  updatePlayerAvailability(schedule, status){
    // show loader
    this.loadingSpinner = true;
    // call an API
    this.leagueService.updatePlayerAvailability(schedule.schedule.fixtureId, 0, schedule.schedule.clubId, schedule.status)
    .subscribe((value: any) => {
      // hide loader
      this.loadingSpinner = false;
      // check response
      if (value.responseState && value.data) {
        // Refresh the List
        this.getMySchedule();
      } else {
        this.ccUtil.messageAlert('Status Update', 'Something went wrong, Please try later');
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

}
