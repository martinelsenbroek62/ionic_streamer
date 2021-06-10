import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CcutilService } from 'src/app/services/ccutil.service';

@Component({
  selector: 'app-news-list',
  templateUrl: './news-list.page.html',
  styleUrls: ['./news-list.page.scss'],
})
export class NewsListPage implements OnInit {

  newsList: any;

  constructor(private router: Router, public ccUtil: CcutilService) {
    if (this.router.getCurrentNavigation().extras.state) {
      this.newsList = this.router.getCurrentNavigation().extras.state.newsList;
    }
  }

  ngOnInit() {
  }

  detailNews(news) {
    this.router.navigate(['/news-blog-detail'], { state: {detail: news, type: 'News'}});
  }

}
