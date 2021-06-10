import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CcutilService } from 'src/app/services/ccutil.service';
import { LeagueService } from '../services/league.service';

@Component({
  selector: 'app-player-stats',
  templateUrl: './player-stats.page.html',
  styleUrls: ['./player-stats.page.scss'],
})
export class PlayerStatsPage implements OnInit {

  type: any;
  clubId: any;
  categoryArr: any;
  seriesList: any;
  selectSeriesDropdown: any;
  selectCategoryDropdown: any;
  battingStatsList = [];
  orderByParam: any;
  seriesDetails: any;
  loadingSpinner = false;

  constructor(private router: Router, private leagueService: LeagueService, public ccUtil: CcutilService) {
    if (this.router.getCurrentNavigation().extras.state) {
      this.type = this.router.getCurrentNavigation().extras.state.type;
      this.clubId = this.router.getCurrentNavigation().extras.state.clubId;
      this.categoryArr = this.router.getCurrentNavigation().extras.state.categoryArr;
      this.seriesList = this.router.getCurrentNavigation().extras.state.seriesList;
      this.selectSeriesDropdown = this.router.getCurrentNavigation().extras.state.selectSeriesDropdown;
      this.seriesDetails = this.router.getCurrentNavigation().extras.state.seriesDetails;
      // initially select first selectCategoryDropdown
      this.selectCategoryDropdown = this.categoryArr[0].category;
      // call categoryChanged to set orderByParam
      this.categoryChanged();
      // get batting stats if type is 'Batting' etc.
      this.getStats();
    }
  }

  ngOnInit() {
  }

  categoryChanged() {
    switch (this.selectCategoryDropdown) {
      case 'Most Runs':
        this.orderByParam = 'runsScored';
        break;
      case 'Most Fours':
        this.orderByParam = 'fours';
        break;
      case 'Most Sixes':
        this.orderByParam = 'sixers';
        break;
      case 'Most Wickets':
        // this.orderByParam = '';
        break;
      case 'Most Catches':
        // this.orderByParam = '';
        break;
    }
  }

  getStats() {
    this.loadingSpinner = true;
    // call an API
    let temp: any;
    if (this.type === 'Batting') {
      temp = this.leagueService.getBattingStats(this.clubId, this.selectSeriesDropdown);
    } else if (this.type === 'Bowling') {
      temp = this.leagueService.getBowlingStats(this.clubId, this.selectSeriesDropdown);
    } else if (this.type === 'Feilding') {
      temp = this.leagueService.getFeildingStats(this.clubId, this.selectSeriesDropdown);
    }
    temp.subscribe((value: any) => {
      // hide loader
      this.loadingSpinner = false;
      // check response
      if (value.responseState && value.data) {
        // get articlesList
        this.battingStatsList = value.data;
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
      if(error.name === 'HttpErrorResponse')
        this.ccUtil.fail_modal('Please check your Network Connection');
      else
        this.ccUtil.fail_modal(error.message);
    });
  }
}
