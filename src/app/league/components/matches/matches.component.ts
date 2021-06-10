import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { CcutilService } from 'src/app/services/ccutil.service';

@Component({
  selector: 'app-matches',
  templateUrl: './matches.component.html',
  styleUrls: ['./matches.component.scss'],
})
export class MatchesComponent implements OnInit {
  @Input() matchList:any;
  @Output() cardClick: EventEmitter<any> = new EventEmitter();

  constructor(public ccUtil: CcutilService, private iab: InAppBrowser) {
  }

  ngOnInit() {
    console.log(this.matchList);
  }

  async onCardClick(event, match) {
    this.cardClick.emit({ event, match }); // emit event here
  }

  openYoutubeLink(URL) {
    this.iab.create(URL, '_system', { location: 'no', zoom: 'yes', hideurlbar: 'yes' });
  }

}
