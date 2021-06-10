import { Component, Input, OnInit } from '@angular/core';
import { CcutilService } from 'src/app/services/ccutil.service';

@Component({
  selector: 'app-scorecard-team-scores',
  templateUrl: './scorecard-team-scores.component.html',
  styleUrls: ['./scorecard-team-scores.component.scss'],
})
export class ScorecardTeamScoresComponent implements OnInit {

  @Input() inningsScore: any;

  constructor(public ccUtil: CcutilService) { }

  ngOnInit() {
    console.log('inningsScore... ', this.inningsScore);
  }

}
