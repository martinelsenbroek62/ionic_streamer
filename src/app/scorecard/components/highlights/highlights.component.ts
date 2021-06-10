import { Component, Input, OnInit } from '@angular/core';
import { CcutilService } from 'src/app/services/ccutil.service';

@Component({
  selector: 'app-highlights',
  templateUrl: './highlights.component.html',
  styleUrls: ['./highlights.component.scss'],
})
export class HighlightsComponent implements OnInit {

  @Input() ballByBall;
  @Input() matchInfo: any;
  // headers will be hidden in Highlights
  @Input() hideHeaders;

  filterKey = 'all';

  constructor(public ccUtil: CcutilService) { }

  ngOnInit() {}

}
