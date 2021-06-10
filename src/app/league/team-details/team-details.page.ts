import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController, AlertController, IonSlides, ModalController } from '@ionic/angular';
import { CcutilService } from 'src/app/services/ccutil.service';
import { AddPlayerToTeamComponent } from '../components/add-player-to-team/add-player-to-team.component';
import { LeagueService } from '../services/league.service';

@Component({
  selector: 'app-team-details',
  templateUrl: './team-details.page.html',
  styleUrls: ['./team-details.page.scss'],
})
export class TeamDetailsPage implements OnInit {
  @ViewChild('slides', { static: true }) slider: IonSlides;
  // @ViewChild('scroll') scroll: Content;
  // @ViewChildren('myScroll') components:QueryList<Scroll>;

  public currentSegmentName = 0;
  loadingSpinner = false;
  errorMessage: any;

  showResults = true;
  showSchedule = false;

  clubId: any;
  teamInfo: any;
  selectSeriesDropdown: any;
  teamPlayersList: any;
  matchesResultsList: any;
  schedulesList: any;
  pointsList: any;
  albumsList: any;

  constructor(private router: Router, public modalController: ModalController, public ccUtil: CcutilService, private leagueService: LeagueService, public actionSheetController: ActionSheetController, private alertController: AlertController) {
    if (this.router.getCurrentNavigation().extras.state) {
      // get team info
      this.teamInfo = this.router.getCurrentNavigation().extras.state.team;
      this.clubId = this.router.getCurrentNavigation().extras.state.clubId;
      // leagueId is series id
      this.selectSeriesDropdown = this.router.getCurrentNavigation().extras.state.selectSeriesDropdown;
      // fetch team players
      this.getTeamPlayers();
    }
  }

  ngOnInit() {
  }

  async segmentChanged() {
    await this.slider.slideTo(this.currentSegmentName);

    const sliderIndex = await this.slider.getActiveIndex();
    if (sliderIndex == 0) {
      // fetch team players
      this.getTeamPlayers();
    }
    else if(sliderIndex == 1) {
      this.getDataForSecondSegment();
    }
    else if(sliderIndex == 2) {
      this.getPointsTable();
    }
    else if(sliderIndex == 3) {
      // get all top stats
      // this.getAllTopStats();
    }
    else if(sliderIndex == 4) {
      this.getAlbums();
    }
  }

  doRefresh(event) {
    if (this.currentSegmentName == 0) {
      // fetch team players
      this.getTeamPlayers();
    }
    else if (this.currentSegmentName == 1) {
      this.getDataForSecondSegment();
    }
    else if (this.currentSegmentName == 2) {
      this.getPointsTable();
    }
    else if (this.currentSegmentName == 3) {
      // this.getAllTopStats();
    }
    else if (this.currentSegmentName == 4) {
      this.getAlbums();
    }
    // hide loading spinner after 5 sec.
    setTimeout(() => {
      event.target.complete();
    }, 5000);
  }

  async slideChanged() {
    this.currentSegmentName = await this.slider.getActiveIndex();
  }

  // when currentSegmentName == 1
  getDataForSecondSegment() {
    // initially matches can be loaded with empty series and team - later when select the filtered data can be laoded
    this.getMatchesOrSchedules();
  }

  getMatchesOrSchedules() {
    // get matches
    if (this.showResults) { this.getLeagueMatchesResults(); }
    // get schedules
    if (this.showSchedule) { this.getLeagueSchedules(); }
  }

  getLeagueMatchesResults() {
    this.loadingSpinner = true;
    // call an API
    this.leagueService.getLeagueMatchesResults(this.clubId, this.selectSeriesDropdown, this.teamInfo.teamID)
    .subscribe((value: any) => {
      // hide loader
      this.loadingSpinner = false;
      // check response
      if (value.responseState && value.data) {
        // get articlesList
        this.matchesResultsList = value.data;
      } else {
        console.log('Failed to call API');
        if (value.errorMessage) {
          this.ccUtil.fail_modal(value.errorMessage);
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

  getLeagueSchedules() {
    this.loadingSpinner = true;
    // call an API
    this.leagueService.getLeagueSchedules(this.clubId, this.selectSeriesDropdown, this.teamInfo.teamID)
    .subscribe((value: any) => {
      // hide loader
      this.loadingSpinner = false;
      // check response
      if (value.responseState && value.data) {
        // get articlesList
        this.schedulesList = value.data;
      } else {
        console.log('Failed to call API');
        if (value.errorMessage) {
          this.ccUtil.fail_modal(value.errorMessage);
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

  getPointsTable() {
    this.loadingSpinner = true;
    // call an API
    this.leagueService.getPointsTable(this.clubId, this.selectSeriesDropdown, this.teamInfo.teamID)
    .subscribe((value: any) => {
      // hide loader
      this.loadingSpinner = false;
      // check response
      if (value.responseState && value.data) {
        // get pointsList
        this.pointsList = value.data;
      } else {
        console.log('Failed to call API');
        if (value.errorMessage) {
          this.ccUtil.fail_modal(value.errorMessage);
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

  getAlbums() {
    this.loadingSpinner = true;
    // call an API
    this.leagueService.getAlbums(this.clubId, this.teamInfo.teamID)
    .subscribe((value: any) => {
      // hide loader
      this.loadingSpinner = false;
      // check response
      if (value.responseState && value.data) {
        // get albumsList
        this.albumsList = value.data;
      } else {
        console.log('Failed to call API');
        if (value.errorMessage) {
          this.ccUtil.fail_modal(value.errorMessage);
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

  getTeamPlayers() {
    this.loadingSpinner = true;
    // call an API
    this.leagueService.getTeamPlayers(this.clubId, this.teamInfo.teamID)
    .subscribe((value: any) => {
      // hide loader
      this.loadingSpinner = false;
      // check response
      if (value.responseState && value.data) {
        // get pointsList
        this.teamPlayersList = value.data;
      } else {
        console.log('Failed to call API');
        if (value.errorMessage) {
          this.ccUtil.fail_modal(value.errorMessage);
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

  async actionOnPlayerClick(player) {
    const actionSheet = await this.actionSheetController.create({
      header: player.firstName + ' ' + player.lastName,
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Player Details',
        icon: 'eye',
        handler: () => {
          console.log('Player Details clicked');
          // this.router.navigate(['/team-details'], { state: {
          //   team,
          //   clubId: this.league.clubId,
          //   selectSeriesDropdown: this.selectSeriesDropdown
          // }});
        }
      }, {
        text: 'Remove from Team',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          console.log('Remove from Team clicked');
          this.removePlayerFromTeam(player.playerID);
        }
      }, {
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

  async removePlayerFromTeam(playerId) {
    const deleteAlert = await this.alertController.create({
      header: 'Remove Player',
      subHeader: 'Are you sure you want to Remove Player from Team?',
      backdropDismiss: false,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            // console.log('Cancel clicked');
          }
        },
        {
          text: 'Ok',
          handler: () => {
            this.leagueService.deletePlayerFromTeam(this.clubId, this.teamInfo.teamID, [playerId])
            .subscribe((resp: any) => {
              if (resp) {
                if (!resp.responseState) {
                  if (!this.ccUtil.isNetworkConnected) {
                    this.errorMessage = 'No Network Connection';
                    this.ccUtil.showError('Oops!!!', 'No Network Connection, please try again');
                  } else {
                    this.errorMessage = 'Unknown Error';
                    this.ccUtil.showError('Oops!!!', 'we are unable to Delete Player, please try again');
                  }
                } else {
                  this.ccUtil.presentToast('Player Removed from Team');
                  this.getTeamPlayers();
                }
              } else {
                this.ccUtil.showError('Delete Player', 'Oops!!! Something went wrong, please try again');
              }
            }, error => {
              this.ccUtil.showError('Delete Player', 'Oops!!! Something went wrong, error: '+ error);
            //  console.log('Error:',error);
            });
          }
        }
      ]
    });
    await deleteAlert.present();
  }

  async addPlayerInTeamModal() {
    const modal = await this.modalController.create({
      component: AddPlayerToTeamComponent,
      cssClass: '',
      componentProps: {
        teamsData: this.teamInfo,
        clubId: this.clubId,
        // leagueId is series id
        leagueId: this.selectSeriesDropdown
      }
    });
    await modal.present();

    const resp: any = await modal.onDidDismiss();
    if (resp && resp.data) {
      // reaload team players to get latest updated list
      this.getTeamPlayers();
    }
  }

  addPlayerToTeam(matchInfo, callback?) {
    // send data to server
    this.errorMessage = '';
    // show loader
    // this.loadingSpinner = true;
    // // call an API
    // this.scoringService.updateMatchData(this.matchData.clubId, this.matchData.matchId, matchInfo)
    // .subscribe((value: any) => {
    //   // hide loader
    //   this.loadingSpinner = false;
    //   // check response
    //   if (value.responseState && value.data) {
    //     console.log('value', value);
    //     this.getLiveScoringTeamsData(this.matchData);
    //     // do callback
    //     if (callback) { callback(value.data) };
    //   } else {
    //     console.log('Failed to call API');
    //     if(value.errorMessage){
    //       this.errorMessage = value.errorMessage;
    //     }
    //   }
    // }, (error) => {
    //   // hide loader
    //   this.loadingSpinner = false;
    //   console.log('Api error');
    //   if(error.name == 'HttpErrorResponse')
    //     this.ccUtil.fail_modal('Please check your Network Connection');
    //   else
    //     this.ccUtil.fail_modal(error.message);
    // });
  }

}
