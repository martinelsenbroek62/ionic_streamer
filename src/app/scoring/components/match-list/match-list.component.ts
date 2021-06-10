import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CcutilService } from 'src/app/services/ccutil.service';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'app-match-list',
  templateUrl: './match-list.component.html',
  styleUrls: ['./match-list.component.scss'],
})
export class MatchListComponent implements OnInit {

  @Input() matchList:any;
  @Input() tabType:any;
  @Output() cardClick: EventEmitter<any> = new EventEmitter();

  constructor(public ccUtil: CcutilService, private iab: InAppBrowser) { }

  ngOnInit() {
    // console.log('match data: ', this.matchList);
  }

  async onCardClick(event, match) {
    this.cardClick.emit({ event, match, tabType: this.tabType }); // emit event here
  }

  openYoutubeLink(URL) {
    this.iab.create(URL, '_system', { location: 'no', zoom: 'yes', hideurlbar: 'yes' });
  }

}
