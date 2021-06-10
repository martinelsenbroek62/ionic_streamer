import { Content } from '@angular/compiler/src/render3/r3_ast';
import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController, AlertController, IonSlides, ModalController } from '@ionic/angular';
import { CcutilService } from 'src/app/services/ccutil.service';
import { CreateUpdateSeriesComponent } from '../modals/create-update-series/create-update-series.component';
import { CreateUpdateTeamComponent } from '../modals/create-update-team/create-update-team.component';
import { LeagueService } from '../services/league.service';

@Component({
  selector: 'app-club-overview',
  templateUrl: './club-overview.page.html',
  styleUrls: ['./club-overview.page.scss'],
})
export class ClubOverviewPage implements OnInit {
  @ViewChild('slides', { static: true }) slider: IonSlides;
  // @ViewChild('scroll') scroll: Content;
  // @ViewChildren('myScroll') components:QueryList<Scroll>;

  public currentSegmentName = 0;
  league:any;
  showClubInfo = true;

  showResults = true;
  showSchedule = false;

  selectSeriesDropdown: any = '';
  selectTeamDropdown: any = '';
  selectSeriesDropdownMatches: any = '';
  selectTeamDropdownMatches: any = '';

  loadingSpinner = false;

  leagueDetails: any = {
    aboutClub: '',
    currentSeries: '',
    followersCount: 0,
    backGroundImagePath: '',
    logoFilePath: ''
  };
  newsList: any;
  articlesList: any;
  seriesList: any;
  teamsList: any;
  matchesResultsList: any;
  schedulesList: any;
  pointsList: any;
  albumsList: any;
  allTopStatsList: any;
  sponsorsList: any;
  leaguePostsList: any;
  offSet: number = 0;
  matchesLimit: number = 50;
  errorMessage: any;

  showFullAbout = false;

  constructor(private router: Router, private leagueService: LeagueService, public ccUtil: CcutilService, private modalController: ModalController, public actionSheetController: ActionSheetController, private alertController: AlertController) {
    if (this.router.getCurrentNavigation().extras.state) {
      this.league = this.router.getCurrentNavigation().extras.state.data;
      // get data for first segment no. 0
      this.getDataForFirstSegment();
      // load other basic data
      // get league series list
      this.getSeriesList();
    }
  }

  ngOnInit() {}

  async segmentChanged() {
    this.slider.slideTo(this.currentSegmentName);

    const sliderIndex = await this.slider.getActiveIndex();
    if(sliderIndex == 0) {
      this.showClubInfo = true;
      this.getDataForFirstSegment();
    }
    else if(sliderIndex == 1) {
      this.showClubInfo = false;
      this.getDataForSecondSegment();
    }
    else if(sliderIndex == 2) {
      this.showClubInfo = false;
      this.getPointsTable();
    }
    else if(sliderIndex == 3) {
      this.showClubInfo = false;
      // get all top stats
      this.getAllTopStats();
    }
    else if(sliderIndex == 4) {
      this.showClubInfo = false;
      // get teams list
      this.getTeamsList(this.selectSeriesDropdown);
    }
    else if(sliderIndex == 5) {
      this.showClubInfo = false;
      // get teams list
      this.getSeriesList();
    }
    else if(sliderIndex == 6) {
      this.showClubInfo = false;
      this.getAlbums();
    }
  }

  doRefresh(event) {
    if (this.currentSegmentName == 0) {
      this.getDataForFirstSegment();
    }
    else if (this.currentSegmentName == 1) {
      this.getDataForSecondSegment();
    }
    else if (this.currentSegmentName == 2) {
      this.getPointsTable();
    }
    else if (this.currentSegmentName == 3) {
      this.getAllTopStats();
    }
    else if (this.currentSegmentName == 4) {
      this.getTeamsList(this.selectSeriesDropdown);
    }
    else if (this.currentSegmentName == 5) {
      this.getSeriesList();
    }
    else if (this.currentSegmentName == 6) {
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

  playerStatsPage(stats) {
    const categoryArr = this.allTopStatsList.filter((o: any) => {
      if (o.type == stats.type) {
        return o.category;
      }
    });
    this.router.navigate(['/player-stats'], { state: {
      type: stats.type,
      categoryArr,
      seriesList: this.seriesList,
      clubId: this.league.clubId,
      selectSeriesDropdown: this.selectSeriesDropdown
    }});
  }

  // when currentSegmentName == 0
  getDataForFirstSegment() {
    // get club info and abouts..
    this.getLeagueDetails();
    // get news
    this.getNews();
    // get blogs(articles)
    this.getArticles();
    // get sponsors
    this.getSponsors();
    // get league posts
    this.getLeaguePosts();
  }

  getAndSetCurrentSeriesToDropdown() {
    if ((!this.selectSeriesDropdown || this.selectSeriesDropdown == '') && this.seriesList && this.seriesList.length > 0) {
      if (this.leagueDetails && this.leagueDetails.currentSeries) {
        const series = this.seriesList.find((o) => o.seriesName == this.leagueDetails.currentSeries);
        this.selectSeriesDropdown = series.seriesID;
      } else {
        this.selectSeriesDropdown = this.seriesList[0].seriesID;
      }
    }
  }

  viewNewsList(newsList) {
    this.router.navigate(['/news-list'], { state: {newsList}});
  }

  viewBlogList(articlesList) {
    this.router.navigate(['/blog-list'], { state: {articlesList}});
  }

  // call an API to get club details
  getLeagueDetails() {
    this.loadingSpinner = true;
    // call an API
    this.leagueService.getLeagueDetails(this.league.clubId)
    .subscribe((value: any) => {
      // hide loader
      this.loadingSpinner = false;
      // check response
      if (value.responseState && value.data) {
        // get leagueDetails
        this.leagueDetails = value.data;
        this.getAndSetCurrentSeriesToDropdown();
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

  followUnfollowLeague(pageId, followUnfollow) {
    this.loadingSpinner = true;
    // call an API
    this.leagueService.followUnfollowLeague(pageId, followUnfollow)
    .subscribe((value: any) => {
      // hide loader
      this.loadingSpinner = false;
      // check response
      if (value.responseState && value.data) {
        // get leagueDetails
        console.log(value);
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

  // call an API to get news
  getNews() {
    this.loadingSpinner = true;
    // call an API
    this.leagueService.getNews(this.league.clubId)
    .subscribe((value: any) => {
      // hide loader
      this.loadingSpinner = false;
      // check response
      if (value.responseState && value.data) {
        // get newsList
        this.newsList = value.data;
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

  // call an API to get blogs(articles)
  getArticles() {
    this.loadingSpinner = true;
    // call an API
    this.leagueService.getArticles(this.league.clubId)
    .subscribe((value: any) => {
      // hide loader
      this.loadingSpinner = false;
      // check response
      if (value.responseState && value.data) {
        // get articlesList
        this.articlesList = value.data;
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

  getSponsors() {
    this.loadingSpinner = true;
    // call an API
    this.leagueService.getAllSponsor(this.league.clubId)
    .subscribe((value: any) => {
      // hide loader
      this.loadingSpinner = false;
      // check response
      if (value.responseState && value.data) {
        // get articlesList
        this.sponsorsList = value.data;
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

  getLeaguePosts() {
    this.loadingSpinner = true;
    // call an API
    this.leagueService.getLeaguePosts(this.league.clubId)
    .subscribe((value: any) => {
      // hide loader
      this.loadingSpinner = false;
      // check response
      if (value.responseState && value.data) {
        // get articlesList
        this.leaguePostsList = value.data;
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

  showPostActions(event) {
    console.log('event.postId', event.postId);
  }

  // when currentSegmentName == 1
  getDataForSecondSegment() {
    // initially matches can be loaded with empty series and team - later when select the filtered data can be laoded
    this.getMatchesOrSchedules();
  }

  getSeriesList(callback?) {
    this.loadingSpinner = true;
    // call an API
    this.leagueService.getSeriesList(this.league.clubId)
    .subscribe((value: any) => {
      // hide loader
      this.loadingSpinner = false;
      // check response
      if (value.responseState && value.data) {
        // get articlesList
        this.seriesList = value.data;
        this.getAndSetCurrentSeriesToDropdown();
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

  getTeamsList(selectSeriesDropdown, callback?) {
    if (!this.selectSeriesDropdown) {
      // this.ccUtil.messageAlert('Alert', 'Select series first to get teams.');
      return;
    }
    this.loadingSpinner = true;
    // call an API
    this.leagueService.getTeamsList(this.league.clubId, selectSeriesDropdown)
    .subscribe((value: any) => {
      // hide loader
      this.loadingSpinner = false;
      // check response
      if (value.responseState && value.data) {
        // get articlesList
        this.teamsList = value.data;
        if (this.teamsList && this.teamsList.length > 0) {
          this.selectTeamDropdown = this.teamsList[0].teamID;
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

  getMatchesOrSchedules() {
    // get matches
    if (this.showResults) { this.getLeagueMatchesResults(this.selectSeriesDropdownMatches, this.selectTeamDropdownMatches); }
    // get schedules
    if (this.showSchedule) { this.getLeagueSchedules(this.selectSeriesDropdownMatches, this.selectTeamDropdownMatches); }
  }

  getMoreMatches(){
    this.offSet += this.matchesLimit;
    this.getLeagueMatchesResults(this.selectSeriesDropdownMatches, this.selectTeamDropdownMatches);
  }

  getLeagueMatchesResults(selectSeriesDropdown, selectTeamDropdown) {
    this.loadingSpinner = true;
    // call an API
    this.leagueService.getLeagueMatchesResults(this.league.clubId, selectSeriesDropdown, selectTeamDropdown, this.matchesLimit, this.offSet)
    .subscribe((value: any) => {
      // hide loader
      this.loadingSpinner = false;
      // check response
      if (value.responseState && value.data) {
        // get articlesList
        if (!this.matchesResultsList)
          this.matchesResultsList = value.data;
        else
          this.matchesResultsList = this.matchesResultsList.concat(value.data);
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
    this.leagueService.getLeagueSchedules(this.league.clubId, selectSeriesDropdown, selectTeamDropdown)
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
    this.leagueService.getPointsTable(this.league.clubId, this.selectSeriesDropdown)
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
    this.leagueService.getAlbums(this.league.clubId)
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

  // getTeamPlayers() {
  //   this.teamPlayersSpinner = true;
  //   // call an API
  //   this.leagueService.getTeamPlayers(this.league.clubId, this.selectTeamDropdown)
  //   .subscribe((value: any) => {
  //     // hide loader
  //     this.teamPlayersSpinner = false;
  //     // check response
  //     if (value.responseState && value.data) {
  //       // get articlesList
  //       this.teamPlayersList = value.data;
  //     } else {
  //       console.log('Failed to call API');
  //       if (value.errorMessage) {
  //         this.ccUtil.fail_modal(value.errorMessage);
  //       }
  //     }
  //   }, (error) => {
  //     // hide loader
  //     this.teamPlayersSpinner = false;
  //     console.log('Api error');
  //     if(error.name == 'HttpErrorResponse')
  //       this.ccUtil.fail_modal('Please check your Network Connection');
  //     else
  //       this.ccUtil.fail_modal(error.message);
  //   });
  // }

  getAllTopStats() {
    this.loadingSpinner = true;
    // call an API
    this.leagueService.getAllTopStats(this.league.clubId, this.selectSeriesDropdown)
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

  async addUpdateTeamModal(teamsObj?) {
    // teamsObj need when editing a team
    const modal = await this.modalController.create({
      component: CreateUpdateTeamComponent,
      cssClass: '',
      componentProps: {
        teamsObj,
        seriesList: this.seriesList,
        clubId: this.league.clubId,
        seriesId: this.selectSeriesDropdown
      }
    });
    await modal.present();

    const resp: any = await modal.onDidDismiss();
    if (resp && resp.data) {
      console.log('resp.data', resp.data);
      if (resp.data) {
        // refresh teams data
        this.getTeamsList(this.selectSeriesDropdown);
      }
    }
  }

  async addUpdateSeriesModal(seriesObj?) {
    // seriesObj need when editing a series
    const modal = await this.modalController.create({
      component: CreateUpdateSeriesComponent,
      cssClass: '',
      componentProps: {
        seriesObj,
        clubId: this.league.clubId,
      }
    });
    await modal.present();

    const resp: any = await modal.onDidDismiss();
    if (resp && resp.data) {
      console.log('resp.data', resp.data);
      if (resp.data) {
        // refresh teams data
        this.getSeriesList();
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
            clubId: this.league.clubId,
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

  async actionOnSeriesClick(series) {
    const actionSheet = await this.actionSheetController.create({
      header: series.seriesName,
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Series Details',
        icon: 'eye',
        handler: () => {
          console.log('Series Details clicked');
          this.router.navigate(['/series-details'], { state: {
            series,
            clubId: this.league.clubId
          }});
        }
      }, {
        text: 'Edit Series',
        icon: 'pencil',
        handler: () => {
          console.log('Edit Series clicked');
          this.addUpdateSeriesModal(series);
        }
      },{
        text: 'Delete Series',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          console.log('Delete Series clicked');
          this.deleteSeries(series.seriesID)
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

  async deleteSeries(seriesId) {
    const deleteAlert = await this.alertController.create({
      header: 'Delete Series',
      subHeader: 'Are you sure you want to delete Series?',
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
            this.loadingSpinner = true;
            this.leagueService.deleteSeries(this.league.clubId, seriesId)
            .subscribe((resp: any) => {
              this.loadingSpinner = false;
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
                    this.ccUtil.showError('Oops!!!', 'we are unable to Delete Series, please try again');
                  }
                } else {
                  if (resp.data == 'Series Deleted') {
                    this.ccUtil.presentToast('Series Deleted');
                    this.getSeriesList();
                  } else {
                    this.ccUtil.showError('Delete Series', 'Oops!!! Something went wrong, please try again');
                  }
                }
              } else {
                this.ccUtil.showError('Delete Series', 'Oops!!! Something went wrong, please try again');
              }
            }, error => {
              this.loadingSpinner = false;
              this.ccUtil.showError('Delete Series', 'Oops!!! Something went wrong, error: '+ error);
            //  console.log('Error:',error);
            });
          }
        }
      ]
    });
    await deleteAlert.present();
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
            this.leagueService.deleteTeam(this.league.clubId, teamId)
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
                    this.getTeamsList(this.selectSeriesDropdown);
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
}
