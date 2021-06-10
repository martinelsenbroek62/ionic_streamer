import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonSlides } from '@ionic/angular';
import { CcutilService } from 'src/app/services/ccutil.service';
import { LeagueService } from '../services/league.service';

@Component({
  selector: 'app-international',
  templateUrl: './international.page.html',
  styleUrls: ['./international.page.scss'],
})
export class InternationalPage implements OnInit {
  @ViewChild('slides', { static: true }) slider: IonSlides;

  public current_segment_name = 0;
  loadingSpinner: any;
  liveMatches: any = [];
  completedMatches: any = [];
  upcomingMatches: any = [];
  internationalClubId: any = 11707;
  seriesList: any = [];
  selectedSeries: any;
  leaguePostsList: any = [];
  newsList: any = [];

  constructor(private router: Router, public ccUtil: CcutilService, private leagueService: LeagueService) { }

  ngOnInit() {
    this.getSeriesList();
    this.getNews();
    this.getLeaguePosts();
    this.getInternationalMatches();
    // this.liveMatches = [{"clubId":50,"clubName":"Live Scoring Preparation Camp","matchId":622,"matchDate":"11/26/2020","matchDateFormated":"Nov-26-2020","day":"Thursday","isComplete":0,"overs":20,"winner":0,"teamOne":217,"teamOneName":"India","teamTwo":206,"teamTwoName":"Blackcaps","t1_logo_file_path":"/documentsRep/teamLogos/india.jpg","t2_logo_file_path":"/documentsRep/teamLogos/80287e2e-59dc-4f43-82c1-3c859e2a886c.jpg","isFollowon":0,"seriesType":"Twenty20","timeSinceLastUpdate":"14 days ago.","matchType":"l","result":"India: 0/0(0.0/20 ov)  ","liveStreamLink":"","t1total":0,"t2total":0,"t1balls":0,"t2balls":0,"t1wickets":0,"t2wickets":0,"t1_1total":0,"t2_1total":0,"t1_1balls":0,"t2_1balls":0,"t1_1wickets":0,"t2_1wickets":0,"t1_2total":0,"t2_2total":0,"t1_2balls":0,"t2_2balls":0,"t1_2wickets":0,"t2_2wickets":0},{"clubId":50,"clubName":"Live Scoring Preparation Camp","matchId":603,"matchDate":"10/31/2020","matchDateFormated":"Oct-31-2020","day":"Saturday","isComplete":0,"overs":20,"winner":0,"teamOne":217,"teamOneName":"India","teamTwo":219,"teamTwoName":"Pakisthan","t1_logo_file_path":"/documentsRep/teamLogos/india.jpg","t2_logo_file_path":"/documentsRep/teamLogos/5ca90d2a-fcd5-46d2-bd1a-395f69956678.jpg","isFollowon":0,"seriesType":"Twenty20","timeSinceLastUpdate":"47 days ago.","matchType":"l","result":"India: 119/4(13.5/20 ov)  Pakisthan: 44/0(5.0/20.0 ov)","liveStreamLink":"","t1total":119,"t2total":44,"t1balls":83,"t2balls":30,"t1wickets":4,"t2wickets":0,"t1_1total":119,"t2_1total":44,"t1_1balls":83,"t2_1balls":44,"t1_1wickets":4,"t2_1wickets":0,"t1_2total":0,"t2_2total":0,"t1_2balls":0,"t2_2balls":0,"t1_2wickets":0,"t2_2wickets":0}];
    // this.completedMatches = [{"clubId":50,"clubName":"Live Scoring Preparation Camp","matchId":622,"matchDate":"11/26/2020","matchDateFormated":"Nov-26-2020","day":"Thursday","isComplete":1,"overs":20,"winner":0,"teamOne":217,"teamOneName":"India","teamTwo":206,"teamTwoName":"Blackcaps","t1_logo_file_path":"/documentsRep/teamLogos/india.jpg","t2_logo_file_path":"/documentsRep/teamLogos/80287e2e-59dc-4f43-82c1-3c859e2a886c.jpg","isFollowon":0,"seriesType":"Twenty20","timeSinceLastUpdate":"14 days ago.","matchType":"l","result":"India: 0/0(0.0/20 ov)  ","liveStreamLink":"","t1total":0,"t2total":0,"t1balls":0,"t2balls":0,"t1wickets":0,"t2wickets":0,"t1_1total":0,"t2_1total":0,"t1_1balls":0,"t2_1balls":0,"t1_1wickets":0,"t2_1wickets":0,"t1_2total":0,"t2_2total":0,"t1_2balls":0,"t2_2balls":0,"t1_2wickets":0,"t2_2wickets":0},{"clubId":50,"clubName":"Live Scoring Preparation Camp","matchId":603,"matchDate":"10/31/2020","matchDateFormated":"Oct-31-2020","day":"Saturday","isComplete":1,"overs":20,"winner":0,"teamOne":217,"teamOneName":"India","teamTwo":219,"teamTwoName":"Pakisthan","t1_logo_file_path":"/documentsRep/teamLogos/india.jpg","t2_logo_file_path":"/documentsRep/teamLogos/5ca90d2a-fcd5-46d2-bd1a-395f69956678.jpg","isFollowon":0,"seriesType":"Twenty20","timeSinceLastUpdate":"47 days ago.","matchType":"l","result":"India: 119/4(13.5/20 ov)  Pakisthan: 44/0(5.0/20.0 ov)","liveStreamLink":"","t1total":119,"t2total":44,"t1balls":83,"t2balls":30,"t1wickets":4,"t2wickets":0,"t1_1total":119,"t2_1total":44,"t1_1balls":83,"t2_1balls":44,"t1_1wickets":4,"t2_1wickets":0,"t1_2total":0,"t2_2total":0,"t1_2balls":0,"t2_2balls":0,"t1_2wickets":0,"t2_2wickets":0}];
    // this.upcomingMatches = [{"fixtureId":1472,"teamOne":368,"teamTwo":367,"internalClubOne":0,"internalClubTwo":0,"teamOneName":"Srilanka","teamTwoName":"Pakisthan","date":"12/10/2020","fixedFormatDate":"2020-12-10","time":"4:29 am","matchType":"l","location":"","locationMap":"","leagueId":74,"leagueName":"Winter 2020","comment":"","limit":0,"matchID":643,"umpire1":"","umpire2":"","matchLocked":false,"t1Description":"","t2Description":"","groundId":0,"umpire1TeamId":0,"umpire2TeamId":0,"umpire1Id":0,"umpire2Id":0,"scorerId":0,"paperScorerId":0,"t1_logo_file_path":"/documentsRep/teamLogos/srilanka.jpg","t2_logo_file_path":"/documentsRep/teamLogos/5ca90d2a-fcd5-46d2-bd1a-395f69956678.jpg","seriesType":"Twenty20","isMatchComplete":false,"clubId":0,"clubName":"","playerTeam":0,"isFantasy":false,"countOfPlayerStatus":{"clubId":0,"fixtureId":0,"teamId":0,"countOfAvailablePlayers":0,"countOfNotAvailablePlayers":0,"countOfNotSurePlayers":0,"isTeamFinalized":false}}, {"fixtureId":1472,"teamOne":368,"teamTwo":367,"internalClubOne":0,"internalClubTwo":0,"teamOneName":"Srilanka","teamTwoName":"Pakisthan","date":"12/10/2020","fixedFormatDate":"2020-12-10","time":"4:29 am","matchType":"l","location":"","locationMap":"","leagueId":74,"leagueName":"Winter 2020","comment":"","limit":0,"matchID":643,"umpire1":"","umpire2":"","matchLocked":false,"t1Description":"","t2Description":"","groundId":0,"umpire1TeamId":0,"umpire2TeamId":0,"umpire1Id":0,"umpire2Id":0,"scorerId":0,"paperScorerId":0,"t1_logo_file_path":"/documentsRep/teamLogos/srilanka.jpg","t2_logo_file_path":"/documentsRep/teamLogos/5ca90d2a-fcd5-46d2-bd1a-395f69956678.jpg","seriesType":"Twenty20","isMatchComplete":false,"clubId":0,"clubName":"","playerTeam":0,"isFantasy":false,"countOfPlayerStatus":{"clubId":0,"fixtureId":0,"teamId":0,"countOfAvailablePlayers":0,"countOfNotAvailablePlayers":0,"countOfNotSurePlayers":0,"isTeamFinalized":false}}];
  }

  async segmentChanged() {
    console.log(this.current_segment_name);
  }

  toNumber(str) {
    return Number(str);
  }

  selectSeries(seriesId) {
    this.router.navigate(['/series-details'], { state: { data: seriesId} });
  }

  goToMatchesPage(){
    const league = {clubId: this.internationalClubId};

    if(this.current_segment_name == 0){
      this.router.navigate(['/club-overview'], { state: { data: league} });
    } else if(this.current_segment_name == 1){
      this.router.navigate(['/club-overview'], { state: { data: league} });
    } else if(this.current_segment_name == 2){
      this.router.navigate(['/club-overview'], { state: { data: league} });
    }
  }

  getSeriesList() {
    this.loadingSpinner = true;
    // call an API
    this.leagueService.getSeriesList(this.internationalClubId, 5)
    .subscribe((value: any) => {
      // hide loader
      this.loadingSpinner = false;
      // check response
      if (value.responseState && value.data) {
        this.seriesList = value.data;
        // this.seriesList = value.data;
        this.selectedSeries = this.seriesList[0].seriesID;
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
    this.leagueService.getLeaguePosts(this.internationalClubId)
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

  // call an API to get news
  getNews() {
    this.loadingSpinner = true;
    // call an API
    this.leagueService.getNews(this.internationalClubId)
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

  getInternationalMatches() {
    this.loadingSpinner = true;
    // call an API
    this.leagueService.getInternationalMatches()
    .subscribe((value: any) => {
      // hide loader
      this.loadingSpinner = false;
      // check response
      if (value.responseState && value.data) {
        // get newsList
        this.liveMatches = value.data.LiveMatches;
        this.upcomingMatches = value.data.upcomingMatches;
        this.completedMatches = value.data.completedMatches;
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
}
