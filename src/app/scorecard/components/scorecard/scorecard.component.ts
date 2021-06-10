import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-scorecard-component',
  templateUrl: './scorecard.component.html',
  styleUrls: ['./scorecard.component.scss'],
})
export class ScorecardComponent implements OnInit {

  @Input() scorecard: any;
  @Input() matchInfo: any;

  // to toggle show/hide team players details
  activeInningOne = true;
  activeInningTwo = false;
  activeInningThird = false;
  activeInningFourth = false;

  constructor() { }

  ngOnInit() {}

  toNumber(str) {
    return Number(str);
  }

}
