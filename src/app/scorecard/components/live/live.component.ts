import { Component, Input, OnInit } from '@angular/core';
import { CcutilService } from 'src/app/services/ccutil.service';

@Component({
  selector: 'app-live',
  templateUrl: './live.component.html',
  styleUrls: ['./live.component.scss'],
})
export class LiveComponent implements OnInit {

  @Input() ballByBall;
  @Input() matchInfo: any;

  constructor(public ccUtil: CcutilService) { }

  ngOnInit() {}

}
