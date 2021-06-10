import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController, AlertController, IonSlides, ModalController } from '@ionic/angular';
import { CcutilService } from 'src/app/services/ccutil.service';
import { AddPlayerToTeamComponent } from '../components/add-player-to-team/add-player-to-team.component';
import { CreateUpdateTeamComponent } from '../modals/create-update-team/create-update-team.component';
import { LeagueService } from '../services/league.service';

@Component({
  selector: 'app-series-details',
  templateUrl: './series-details.page.html',
  styleUrls: ['./series-details.page.scss'],
})
export class SeriesDetailsPage implements OnInit {
  @ViewChild('slides', { static: true }) slider: IonSlides;
  // @ViewChild('scroll') scroll: Content;
  // @ViewChildren('myScroll') components:QueryList<Scroll>;

  public currentSegmentName = 0;
  loadingSpinner = false;
  errorMessage: any;

  showResults = true;
  showSchedule = false;

  clubId: any;
  seriesInfo: any;
  selectSeriesDropdown: any;
  seriesDetails: any;
  matchesResultsList: any;
  schedulesList: any;
  pointsList: any;
  albumsList: any;
  teamsList: any;
  selectTeamDropdownMatches: any = '';
  allTopStatsList: any;

  constructor(private router: Router, public modalController: ModalController, public ccUtil: CcutilService, private leagueService: LeagueService, public actionSheetController: ActionSheetController, private alertController: AlertController) {
    if (this.router.getCurrentNavigation().extras.state) {
      // get team info
      this.seriesInfo = this.router.getCurrentNavigation().extras.state.series;
      this.clubId = this.router.getCurrentNavigation().extras.state.clubId;
      // leagueId is series id
      this.selectSeriesDropdown = this.seriesInfo.seriesID;
      // fetch series details
      this.getSeriesDetails();
      // get teamsList from previous page
      this.getTeamsList(() => {
        this.getMatchesOrSchedules();
      });
    }
  }

  ngOnInit() {
  }

  async segmentChanged() {
    await this.slider.slideTo(this.currentSegmentName);

    const sliderIndex = await this.slider.getActiveIndex();
    if (sliderIndex == 0) {
      // fetch team players
      this.getSeriesDetails();
      this.getMatchesOrSchedules();
    }
    else if(sliderIndex == 1) {
      this.getPointsTable();
    }
    else if(sliderIndex == 2) {
      // get all top stats
      this.getAllTopStats();
    }
    else if(sliderIndex == 3) {
      // get teams list
      this.getTeamsList();
    }
    else if(sliderIndex == 4) {
      this.getAlbums();
    }
  }

  doRefresh(event) {
    if (this.currentSegmentName == 0) {
      // fetch team players
      this.getSeriesDetails();
      this.getMatchesOrSchedules();
    }
    else if (this.currentSegmentName == 1) {
      this.getPointsTable();
    }
    else if (this.currentSegmentName == 2) {
      this.getAllTopStats();
    }
    else if (this.currentSegmentName == 3) {
      // get teams list
      this.getTeamsList();
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

  getMatchesOrSchedules() {
    // get matches
    if (this.showResults) { this.getLeagueMatchesResults(this.selectSeriesDropdown, this.selectTeamDropdownMatches); }
    // get schedules
    if (this.showSchedule) { this.getLeagueSchedules(this.selectSeriesDropdown, this.selectTeamDropdownMatches); }
  }

  getLeagueMatchesResults(selectSeriesDropdown, selectTeamDropdown) {
    this.loadingSpinner = true;
    // call an API
    this.leagueService.getLeagueMatchesResults(this.clubId, selectSeriesDropdown, selectTeamDropdown)
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

  getLeagueSchedules(selectSeriesDropdown, selectTeamDropdown) {
    this.loadingSpinner = true;
    // call an API
    this.leagueService.getLeagueSchedules(this.clubId, selectSeriesDropdown, selectTeamDropdown)
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
    this.leagueService.getPointsTable(this.clubId, this.selectSeriesDropdown, undefined)
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
    this.leagueService.getAlbums(this.clubId, undefined)
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

  getTeamsList(callback?) {
    if (!this.selectSeriesDropdown) {
      // this.ccUtil.messageAlert('Alert', 'Select series first to get teams.');
      return;
    }
    this.loadingSpinner = true;
    // call an API
    this.leagueService.getTeamsList(this.clubId, this.selectSeriesDropdown)
    .subscribe((value: any) => {
      // hide loader
      this.loadingSpinner = false;
      // check response
      if (value.responseState && value.data) {
        // get articlesList
        this.teamsList = value.data;
        if (this.teamsList && this.teamsList.length > 0) {
          this.selectTeamDropdownMatches = this.teamsList[0].teamID;
        }
        if (callback) { callback(); };
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

  getSeriesDetails() {
    this.loadingSpinner = true;
    // call an API
    this.leagueService.getSeriesDetails(this.clubId, this.seriesInfo.seriesID)
    .subscribe((value: any) => {
      // hide loader
      this.loadingSpinner = false;
      // check response
      if (value.responseState && value.data) {
        // get seriesDetails
        this.seriesDetails = value.data;
        console.log('this.seriesDetails', this.seriesDetails);
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

  async addUpdateTeamModal(teamsObj?) {
    // teamsObj need when editing a team
    const modal = await this.modalController.create({
      component: CreateUpdateTeamComponent,
      cssClass: '',
      componentProps: {
        teamsObj,
        seriesList: undefined,
        clubId: this.clubId,
        seriesId: this.selectSeriesDropdown,
        seriesDetails: this.seriesDetails
      }
    });
    await modal.present();

    const resp: any = await modal.onDidDismiss();
    if (resp && resp.data) {
      console.log('resp.data', resp.data);
      if (resp.data) {
        // refresh teams data
        this.getTeamsList();
      }
    }
  }

  async actionOnTeamClick(team) {
    const actionSheet = await this.actionSheetController.create({
      header: team.teamName,
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Team Details',
        icon: 'eye',
        handler: () => {
          console.log('Team Details clicked');
          this.router.navigate(['/team-details'], { state: {
            team,
            clubId: this.clubId,
            // leagueId is series id
            selectSeriesDropdown: this.selectSeriesDropdown
          }});
        }
      }, {
        text: 'Edit Team',
        icon: 'pencil',
        handler: () => {
          console.log('Edit Team clicked');
          this.addUpdateTeamModal(team);
        }
      }, {
        text: 'Delete Team',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          console.log('Delete Team clicked');
          this.deleteTeam(team.teamID);
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

  async deleteTeam(teamId) {
    const deleteAlert = await this.alertController.create({
      header: 'Delete Team',
      subHeader: 'Are you sure you want to delete Team?',
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
            this.leagueService.deleteTeam(this.clubId, teamId)
            .subscribe((resp: any) => {
              if (resp) {
                if (!resp.responseState) {
                  if (!this.ccUtil.isNetworkConnected) {
                    this.errorMessage = 'No Network Connection';
                    this.ccUtil.showError('Oops!!!', 'No Network Connection, please try again');
                  }
                  else if (resp.errorMessage) {
                    this.ccUtil.showError('Oops!!!', resp.errorMessage);
                  }
                  else {
                    this.errorMessage = 'Unknown Error';
                    this.ccUtil.showError('Oops!!!', 'we are unable to Delete Team, please try again');
                  }
                } else {
                  if (resp.data == 'Team Deleted') {
                    this.ccUtil.presentToast('Team Deleted');
                    this.getTeamsList();
                  } else {
                    this.ccUtil.showError('Delete Team', 'Oops!!! Something went wrong, please try again');
                  }
                }
              } else {
                this.ccUtil.showError('Delete Team', 'Oops!!! Something went wrong, please try again');
              }
            }, error => {
              this.ccUtil.showError('Delete Team', 'Oops!!! Something went wrong, error: '+ error);
            //  console.log('Error:',error);
            });
          }
        }
      ]
    });
    await deleteAlert.present();
  }

  getAllTopStats() {
    this.loadingSpinner = true;
    // call an API
    this.leagueService.getAllTopStats(this.clubId, this.selectSeriesDropdown)
    .subscribe((value: any) => {
      // hide loader
      this.loadingSpinner = false;
      // check response
      if (value.responseState && value.data) {
        // get articlesList
        this.allTopStatsList = value.data;
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

  playerStatsPage(stats) {
    const categoryArr = this.allTopStatsList.filter((o: any) => {
      if (o.type == stats.type) {
        return o.category;
      }
    });
    this.router.navigate(['/player-stats'], { state: {
      type: stats.type,
      categoryArr,
      seriesList: undefined,
      clubId: this.clubId,
      selectSeriesDropdown: this.selectSeriesDropdown,
      seriesDetails: this.seriesDetails
    }});
  }

}
