import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CcutilService } from 'src/app/services/ccutil.service';

@Component({
  selector: 'app-news-blog-detail',
  templateUrl: './news-blog-detail.page.html',
  styleUrls: ['./news-blog-detail.page.scss'],
})
export class NewsBlogDetailPage implements OnInit {

  detailObject: any;
  detailType: any; // News or Blog

  constructor(private router: Router, public ccUtil: CcutilService) {
    if (this.router.getCurrentNavigation().extras.state) {
      this.detailType = this.router.getCurrentNavigation().extras.state.type;
      this.detailObject = this.router.getCurrentNavigation().extras.state.detail;
    }
  }

  ngOnInit() {
  }

}
