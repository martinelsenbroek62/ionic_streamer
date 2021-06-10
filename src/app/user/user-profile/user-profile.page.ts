
import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonSlides } from '@ionic/angular';
import { CcutilService } from 'src/app/services/ccutil.service';
import { SocialService } from 'src/app/social/services/social.service';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
})
export class UserProfilePage implements OnInit {
  @ViewChild('slides', { static: true }) slider: IonSlides;

  public currentSegmentName = 0;
  showBatting = true;
  showBowling = false;
  loadingSpinner = true;
  errorMessage: any;

  userId: any;
  myGames: any;
  playerDetails: any;
  friendsList: any;
  stats: any;
  charts: any;
  albumsList: any;
  isAuthToken: any;
  postsList: any;

  constructor(private router: Router, private userService: UserService, public ccUtil: CcutilService, 
    private route: ActivatedRoute, private socialApi: SocialService) {
    this.route.queryParams.subscribe(params => {
      // get value from navigation extras
      if (this.router.getCurrentNavigation().extras.state) {
        // get value of match details passed from live-scoring-list page
        this.userId = this.router.getCurrentNavigation().extras.state.data;
        this.isAuthToken = this.router.getCurrentNavigation().extras.state.isAuthToken;
        if (this.userId) {
          // if isAuthToken comes true get details by AuthToken else get by userId
          this.getPlayerDetails();
          this.getFriendsList();
          this.getAllPosts();
        }
      }
    });
  }

  ngOnInit() {
    // this.myGames = [{"clubId":50,"clubName":"Live Scoring Preparation Camp","matchId":622,"matchDate":"11/26/2020","matchDateFormated":"Nov-26-2020","day":"Thursday","isComplete":0,"overs":20,"winner":0,"teamOne":217,"teamOneName":"India","teamTwo":206,"teamTwoName":"Blackcaps","t1_logo_file_path":"/documentsRep/teamLogos/india.jpg","t2_logo_file_path":"/documentsRep/teamLogos/80287e2e-59dc-4f43-82c1-3c859e2a886c.jpg","isFollowon":0,"seriesType":"Twenty20","timeSinceLastUpdate":"14 days ago.","matchType":"l","result":"India: 0/0(0.0/20 ov)  ","liveStreamLink":"","t1total":0,"t2total":0,"t1balls":0,"t2balls":0,"t1wickets":0,"t2wickets":0,"t1_1total":0,"t2_1total":0,"t1_1balls":0,"t2_1balls":0,"t1_1wickets":0,"t2_1wickets":0,"t1_2total":0,"t2_2total":0,"t1_2balls":0,"t2_2balls":0,"t1_2wickets":0,"t2_2wickets":0},{"clubId":50,"clubName":"Live Scoring Preparation Camp","matchId":614,"matchDate":"11/16/2020","matchDateFormated":"Nov-16-2020","day":"Monday","isComplete":1,"overs":99,"winner":330,"teamOne":330,"teamOneName":"India","teamTwo":331,"teamTwoName":"Pakisthan","t1_logo_file_path":"/documentsRep/teamLogos/india.jpg","t2_logo_file_path":"/documentsRep/teamLogos/5ca90d2a-fcd5-46d2-bd1a-395f69956678.jpg","isFollowon":0,"seriesType":"Twenty20","timeSinceLastUpdate":"23 days ago.","matchType":"l","result":"India won by 51 Run(s)","liveStreamLink":"","t1total":111,"t2total":60,"t1balls":37,"t2balls":37,"t1wickets":6,"t2wickets":5,"t1_1total":111,"t2_1total":60,"t1_1balls":37,"t2_1balls":60,"t1_1wickets":6,"t2_1wickets":5,"t1_2total":0,"t2_2total":0,"t1_2balls":0,"t2_2balls":0,"t1_2wickets":0,"t2_2wickets":0},{"clubId":50,"clubName":"Live Scoring Preparation Camp","matchId":603,"matchDate":"10/31/2020","matchDateFormated":"Oct-31-2020","day":"Saturday","isComplete":0,"overs":20,"winner":0,"teamOne":217,"teamOneName":"India","teamTwo":219,"teamTwoName":"Pakisthan","t1_logo_file_path":"/documentsRep/teamLogos/india.jpg","t2_logo_file_path":"/documentsRep/teamLogos/5ca90d2a-fcd5-46d2-bd1a-395f69956678.jpg","isFollowon":0,"seriesType":"Twenty20","timeSinceLastUpdate":"47 days ago.","matchType":"l","result":"India: 119/4(13.5/20 ov)  Pakisthan: 44/0(5.0/20.0 ov)","liveStreamLink":"","t1total":119,"t2total":44,"t1balls":83,"t2balls":30,"t1wickets":4,"t2wickets":0,"t1_1total":119,"t2_1total":44,"t1_1balls":83,"t2_1balls":44,"t1_1wickets":4,"t2_1wickets":0,"t1_2total":0,"t2_2total":0,"t1_2balls":0,"t2_2balls":0,"t1_2wickets":0,"t2_2wickets":0},{"clubId":50,"clubName":"Live Scoring Preparation Camp","matchId":599,"matchDate":"09/29/2020","matchDateFormated":"Sep-29-2020","day":"Tuesday","isComplete":0,"overs":15,"winner":0,"teamOne":217,"teamOneName":"India","teamTwo":206,"teamTwoName":"Blackcaps","t1_logo_file_path":"/documentsRep/teamLogos/india.jpg","t2_logo_file_path":"/documentsRep/teamLogos/80287e2e-59dc-4f43-82c1-3c859e2a886c.jpg","isFollowon":0,"seriesType":"Twenty20","timeSinceLastUpdate":"38 days ago.","matchType":"l","result":"India: 110/0(12.0/15 ov)   (D/L)","liveStreamLink":"","t1total":110,"t2total":0,"t1balls":72,"t2balls":0,"t1wickets":0,"t2wickets":0,"t1_1total":110,"t2_1total":0,"t1_1balls":72,"t2_1balls":0,"t1_1wickets":0,"t2_1wickets":0,"t1_2total":0,"t2_2total":0,"t1_2balls":0,"t2_2balls":0,"t1_2wickets":0,"t2_2wickets":0},{"clubId":50,"clubName":"Live Scoring Preparation Camp","matchId":598,"matchDate":"09/27/2020","matchDateFormated":"Sep-27-2020","day":"Sunday","isComplete":0,"overs":20,"winner":0,"teamOne":217,"teamOneName":"India","teamTwo":218,"teamTwoName":"Srilanka","t1_logo_file_path":"/documentsRep/teamLogos/india.jpg","t2_logo_file_path":"/documentsRep/teamLogos/srilanka.jpg","isFollowon":0,"seriesType":"Twenty20","timeSinceLastUpdate":"46 days ago.","matchType":"l","result":"India: 8/0(1.1/20 ov)  ","liveStreamLink":"","t1total":8,"t2total":0,"t1balls":7,"t2balls":0,"t1wickets":0,"t2wickets":0,"t1_1total":8,"t2_1total":0,"t1_1balls":7,"t2_1balls":0,"t1_1wickets":0,"t2_1wickets":0,"t1_2total":0,"t2_2total":0,"t1_2balls":0,"t2_2balls":0,"t1_2wickets":0,"t2_2wickets":0},{"clubId":50,"clubName":"Live Scoring Preparation Camp","matchId":597,"matchDate":"09/26/2020","matchDateFormated":"Sep-26-2020","day":"Saturday","isComplete":0,"overs":20,"winner":0,"teamOne":217,"teamOneName":"India","teamTwo":219,"teamTwoName":"Pakisthan","t1_logo_file_path":"/documentsRep/teamLogos/india.jpg","t2_logo_file_path":"/documentsRep/teamLogos/5ca90d2a-fcd5-46d2-bd1a-395f69956678.jpg","isFollowon":0,"seriesType":"Twenty20","timeSinceLastUpdate":"79 days ago.","matchType":"l","result":"India: 0/0(0.0/20 ov)  ","liveStreamLink":"","t1total":0,"t2total":0,"t1balls":0,"t2balls":0,"t1wickets":0,"t2wickets":0,"t1_1total":0,"t2_1total":0,"t1_1balls":0,"t2_1balls":0,"t1_1wickets":0,"t2_1wickets":0,"t1_2total":0,"t2_2total":0,"t1_2balls":0,"t2_2balls":0,"t1_2wickets":0,"t2_2wickets":0},{"clubId":50,"clubName":"Live Scoring Preparation Camp","matchId":583,"matchDate":"06/27/2020","matchDateFormated":"Jun-27-2020","day":"Saturday","isComplete":1,"overs":2,"winner":330,"teamOne":330,"teamOneName":"India","teamTwo":331,"teamTwoName":"Pakisthan","t1_logo_file_path":"/documentsRep/teamLogos/india.jpg","t2_logo_file_path":"/documentsRep/teamLogos/5ca90d2a-fcd5-46d2-bd1a-395f69956678.jpg","isFollowon":0,"seriesType":"Twenty20","timeSinceLastUpdate":"164 days ago.","matchType":"l","result":"India won by 3 Run(s)","liveStreamLink":"","t1total":49,"t2total":46,"t1balls":12,"t2balls":12,"t1wickets":0,"t2wickets":0,"t1_1total":49,"t2_1total":46,"t1_1balls":12,"t2_1balls":46,"t1_1wickets":0,"t2_1wickets":0,"t1_2total":0,"t2_2total":0,"t1_2balls":0,"t2_2balls":0,"t1_2wickets":0,"t2_2wickets":0}];
  }

  async segmentChanged() {
    await this.slider.slideTo(this.currentSegmentName);
    const sliderIndex = await this.slider.getActiveIndex();
    if(sliderIndex === 0) {
      this.getPlayerDetails();
      this.getFriendsList();
    }
    else if(sliderIndex === 1) {
      this.getMyGameMyMatches();
    }
    else if(sliderIndex === 2) {
      this.getStats();
    }
    else if(sliderIndex === 3) {
      this.getChart();
    }
    else if(sliderIndex === 4) {
      this.getImages();
    }
  }

  doRefresh(event) {
    if (this.currentSegmentName == 0) {
      this.getPlayerDetails();
      this.getFriendsList();
    }
    else if (this.currentSegmentName == 1) {
      this.getMyGameMyMatches();
    }
    else if (this.currentSegmentName == 2) {
      this.getStats();
    }
    else if (this.currentSegmentName == 3) {
      this.getChart();
    }
    else if (this.currentSegmentName == 4) {
      this.getImages();
    }
    // hide loading spinner after 5 sec.
    setTimeout(() => {
      event.target.complete();
    }, 5000);
  }

  async slideChanged(){
    this.currentSegmentName = await this.slider.getActiveIndex();
  }

  getPlayerDetails() {
    this.loadingSpinner = true;
    this.userService.getPlayerDetails(this.userId, this.isAuthToken)
    .subscribe((value: any) => {
      // check response
      this.loadingSpinner = false;
      if (value.responseState && value.data) {
        // console.log('value', value);
        this.playerDetails = value.data;
        this.playerDetails.playerId = 1026753;
      } else {
        console.log('Failed to call API');
        if (value.errorMessage) {
          this.errorMessage = value.errorMessage;
        }
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

  getFriendsList() {
    // call an API
    this.loadingSpinner = true;
    this.userService.getFriendsList()
    .subscribe((value: any) => {
      // check response
      this.loadingSpinner = false;
      if (value.responseState && value.data) {
        this.friendsList = value.data;
      } else {
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

  getMyGameMyMatches() {
    if (this.playerDetails && this.playerDetails.playerId) {
      this.loadingSpinner = true;
      this.userService.getMyGameMyMatches(this.playerDetails.playerId)
      .subscribe((value: any) => {
        // check response
        this.loadingSpinner = false;
        if (value.responseState && value.data) {
          console.log('value', value);
          this.myGames = value.data;
        } else {
          console.log('Failed to call API');
          if (value.errorMessage) {
            this.errorMessage = value.errorMessage;
          }
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

  getStats() {
    if (this.playerDetails && this.playerDetails.playerId) {
      this.loadingSpinner = true;
      this.userService.getStats(this.playerDetails.playerId)
      .subscribe((value: any) => {
        // check response
        this.loadingSpinner = false;
        if (value.responseState && value.data) {
          // console.log('value', value);
          this.stats = value.data;
        } else {
          console.log('Failed to call API');
          if (value.errorMessage) {
            this.errorMessage = value.errorMessage;
          }
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

  getChart() {
    if (this.playerDetails && this.playerDetails.playerId) {
      this.loadingSpinner = true;
      this.userService.getChart(this.playerDetails.playerId)
      .subscribe((value: any) => {
        // check response
        this.loadingSpinner = false;
        if (value.responseState && value.data) {
          // console.log('value', value);
          this.charts = value.data;
        } else {
          console.log('Failed to call API');
          if (value.errorMessage) {
            this.errorMessage = value.errorMessage;
          }
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

  getImages() {
    if (this.playerDetails && this.playerDetails.playerId) {
      this.loadingSpinner = true;
      this.userService.getImages(this.playerDetails.playerId)
      .subscribe((value: any) => {
        // check response
        this.loadingSpinner = false;
        if (value.responseState && value.data) {
          // console.log('value', value);
          this.albumsList = value.data;
        } else {
          console.log('Failed to call API');
          if (value.errorMessage) {
            this.errorMessage = value.errorMessage;
          }
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

  getAllPosts(callback?){
    // show loader
    this.loadingSpinner = true;
    this.errorMessage = '';

    this.socialApi.getAllPosts()
      .subscribe((value: any) => {
        if (callback) {
          callback();
        }
        // hide loader
        this.loadingSpinner = false;

        // check response
        if (value.responseState && value.data) {
          this.postsList = value.data;
          if(!value.data.length){
            this.errorMessage = 'No Feeds';
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

}
