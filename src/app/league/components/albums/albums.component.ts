import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CcutilService } from 'src/app/services/ccutil.service';

@Component({
  selector: 'app-albums',
  templateUrl: './albums.component.html',
  styleUrls: ['./albums.component.scss'],
})
export class AlbumsComponent implements OnInit {

  @Input() clubId: any;
  @Input() albumsList: any;

  constructor(private router: Router, public ccUtil: CcutilService) { }

  ngOnInit() {}

  albumDetailsPage(albumId) {
    this.router.navigate(['/album-list'], { state: { albumId, clubId: this.clubId} });
  }

}
