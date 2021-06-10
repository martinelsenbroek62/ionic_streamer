import { Component, Input, OnInit } from '@angular/core';
import { CcutilService } from 'src/app/services/ccutil.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss'],
})
export class InfoComponent implements OnInit {

  @Input() matchData: any;
  @Input() matchInfo: any;
  @Input() matchInfoHeaders: any;
  @Input() recentForms: any;
  @Input() previousEncounters: any;
  @Input() matchResultsAtGround: any;
  @Input() playersToWatch: any;

  // to toggle show/hide team players details
  activeTeamOne = true;
  activeTeamTwo = false;
  match: any;
  matchList = [{"clubId":50,"clubName":"Live Scoring Preparation Camp","matchId":622,"matchDate":"11/26/2020","matchDateFormated":"Nov-26-2020","day":"Thursday","isComplete":0,"overs":20,"winner":0,"teamOne":217,"teamOneName":"India","teamTwo":206,"teamTwoName":"Blackcaps","t1_logo_file_path":"/documentsRep/teamLogos/india.jpg","t2_logo_file_path":"/documentsRep/teamLogos/80287e2e-59dc-4f43-82c1-3c859e2a886c.jpg","isFollowon":0,"seriesType":"Twenty20","timeSinceLastUpdate":"14 days ago.","matchType":"l","result":"India: 0/0(0.0/20 ov)  ","liveStreamLink":"","t1total":0,"t2total":0,"t1balls":0,"t2balls":0,"t1wickets":0,"t2wickets":0,"t1_1total":0,"t2_1total":0,"t1_1balls":0,"t2_1balls":0,"t1_1wickets":0,"t2_1wickets":0,"t1_2total":0,"t2_2total":0,"t1_2balls":0,"t2_2balls":0,"t1_2wickets":0,"t2_2wickets":0}];

  constructor(public ccUtil: CcutilService) {
    this.match = this.matchList[0];
  }

  ngOnInit() {}

}
