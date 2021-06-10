import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CcutilService } from 'src/app/services/ccutil.service';
import { LeagueService } from '../services/league.service';

@Component({
  selector: 'app-album-list',
  templateUrl: './album-list.page.html',
  styleUrls: ['./album-list.page.scss'],
})
export class AlbumListPage implements OnInit {

  clubId: any;
  albumId: any;
  albumsSpinner = false;

  albumObject:any;

  constructor(private router: Router, private leagueService: LeagueService, public ccUtil: CcutilService) {
    if (this.router.getCurrentNavigation().extras.state) {
      this.albumId = this.router.getCurrentNavigation().extras.state.albumId;
      this.clubId = this.router.getCurrentNavigation().extras.state.clubId;
      // get album list
      this.getAlbumById();
    }
  }

  ngOnInit() {
  }

  getAlbumById() {
    this.albumsSpinner = true;
    // call an API
    this.leagueService.getAlbumById(this.clubId, this.albumId)
    .subscribe((value: any) => {
      // hide loader
      this.albumsSpinner = false;
      // check response
      if (value.responseState && value.data) {
        // get album details
        this.albumObject = value.data[0];
      } else {
        console.log('Failed to call API');
        if (value.errorMessage) {
          this.ccUtil.fail_modal(value.errorMessage);
        }
      }
    }, (error) => {
      // hide loader
      this.albumsSpinner = false;
      console.log('Api error');
      if(error.name === 'HttpErrorResponse')
        this.ccUtil.fail_modal('Please check your Network Connection');
      else
        this.ccUtil.fail_modal(error.message);
    });
  }

}
