import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonSlides } from '@ionic/angular';
import { CcutilService } from 'src/app/services/ccutil.service';
import { UserService } from 'src/app/user/service/user.service';
import { LeagueService } from '../services/league.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
  @ViewChild('slides', { static: true }) slider: IonSlides;

  currentSegmentName = 0;
  searchString: any;
  errorMessage: string = ''; 
  loadingSpinner: any;
  searchList: any = [];
  pageNumber: any = 1;
  searchCriteria: string = '';

  constructor(public ccUtil: CcutilService, private leagueApi: LeagueService, private router: Router, 
    private userService: UserService) { }

  ngOnInit() {
  }

  async segmentChanged() {
    this.pageNumber = 1;
    await this.slider.slideTo(this.currentSegmentName);

    const sliderIndex = await this.slider.getActiveIndex();
    if(sliderIndex === 0) {
      this.searchCriteria = '';
      this.search();
    } else if(sliderIndex === 1) {
      this.searchCriteria = 'people';
      this.search();
    } else if(sliderIndex === 2) {
      this.searchCriteria = 'post';
      this.search();
    } else if(sliderIndex === 3) {
      this.searchCriteria = 'league';
      this.search();
    } else if(sliderIndex === 4) {
      this.searchCriteria = 'academy';
      this.search();
    }
  }

  goToLeaguePage(league){
    this.router.navigate(['/club-overview'], { state: { data: league} });
  }

  goToUserPage(userId){
    this.router.navigate(['/user-profile'], { state: { data: userId} });
  }

  search() {
    this.errorMessage = '';
    // show loader
    this.loadingSpinner = true;
    // call an API
    this.leagueApi.getSearchResults(this.searchString, this.searchCriteria, this.pageNumber)
    .subscribe((value: any) => {
      // hide loader
      this.loadingSpinner = false;
      // check response
      if (value.responseState && value.data) {
        this.searchList = value.data;
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

  followUnfollowLeague(pageId, action, type) {
    if (localStorage.getItem('X-Auth-Token')){
      this.errorMessage = '';
      // show loader
      this.loadingSpinner = true;
      // call an API
      this.leagueApi.followUnfollowLeague(pageId, action)
      .subscribe((value: any) => {
        // hide loader
        this.loadingSpinner = false;
        // check response
        if (value.responseState && value.data) {
          // update the searchList
          if(type == 'league'){
            const league = this.searchList.leaguesList.find((o) => o.pageId == pageId)
            league.isFollowing = 1;
            league.followersCount += 1;
          } else if(type == 'academy'){
            const academy = this.searchList.academyList.find((o) => o.pageId == pageId)
            academy.isFollowing = 1;
            academy.followersCount += 1;
          }
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
    } else {
      this.ccUtil.loginAlert();
    }
  }

  followUnfollowUser(userId, action) {
    if (localStorage.getItem('X-Auth-Token')){
      this.errorMessage = '';
      // show loader
      this.loadingSpinner = true;
      // call an API
      this.userService.followUnfollowUser(userId, action)
      .subscribe((value: any) => {
        // hide loader
        this.loadingSpinner = false;
        // check response
        if (value.responseState && value.data) {
          // update the searchList
          const user = this.searchList.usersList.find((o) => o.userId == userId)
          user.isFollowing = 1;
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
    } else {
      this.ccUtil.loginAlert();
    }
  }

}
