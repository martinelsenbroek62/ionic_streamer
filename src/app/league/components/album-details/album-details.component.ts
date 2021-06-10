import { Component, Input, OnInit } from '@angular/core';
import { CcutilService } from 'src/app/services/ccutil.service';

@Component({
  selector: 'app-album-details',
  templateUrl: './album-details.component.html',
  styleUrls: ['./album-details.component.scss'],
})
export class AlbumDetailsComponent implements OnInit {

  @Input() albumObject: any;

  constructor(public ccUtil: CcutilService) { }

  ngOnInit() {
    console.log('albumObject', this.albumObject);
  }

}
