import { Component, OnInit, Input } from '@angular/core';
import { CcutilService } from 'src/app/services/ccutil.service';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Router } from '@angular/router';

@Component({
  selector: 'app-international-news',
  templateUrl: './international-news.component.html',
  styleUrls: ['./international-news.component.scss'],
})
export class InternationalNewsComponent implements OnInit {
  @Input() newsList:any;

  constructor(public ccUtil: CcutilService, public socialSharing: SocialSharing, 
    private router: Router) { }

  ngOnInit() {
    console.log(this.newsList);
  }

  shareNews(news, title) {
    this.socialSharing.share(news, title);
  }

  moreNews(newsList) {
    this.router.navigate(['/news-list'], { state: {newsList}});
  }

  detailNews(news) {
    this.router.navigate(['/news-blog-detail'], { state: {detail: news, type: 'News'}});
  }

}
