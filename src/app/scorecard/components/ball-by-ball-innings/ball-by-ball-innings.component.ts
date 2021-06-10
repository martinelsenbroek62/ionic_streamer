import { Component, Input, OnInit } from '@angular/core';
import { CcutilService } from 'src/app/services/ccutil.service';

@Component({
  selector: 'app-ball-by-ball-innings',
  templateUrl: './ball-by-ball-innings.component.html',
  styleUrls: ['./ball-by-ball-innings.component.scss'],
})
export class BallByBallInningsComponent implements OnInit {

  @Input() inningsBalls;
  // to toggle show/hide team players details
  @Input() activeTeam;
  // headers will be hidden in Highlights
  @Input() hideHeaders;
  // filterKey value could be 'all', 'wickets', 'fours' and 'sixes'
  @Input() filterKey;

  constructor(public ccUtil: CcutilService) {}

  ngOnInit() {
    console.log('inningsBalls', this.inningsBalls);
  }

}
