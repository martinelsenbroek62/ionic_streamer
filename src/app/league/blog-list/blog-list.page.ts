import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CcutilService } from 'src/app/services/ccutil.service';

@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.page.html',
  styleUrls: ['./blog-list.page.scss'],
})
export class BlogListPage implements OnInit {

  articlesList: any;

  constructor(private router: Router, public ccUtil: CcutilService) {
    if (this.router.getCurrentNavigation().extras.state) {
      this.articlesList = this.router.getCurrentNavigation().extras.state.articlesList;
    }
  }

  ngOnInit() {
  }

  detailBlog(blog) {
    this.router.navigate(['/news-blog-detail'], { state: {detail: blog, type: 'Blog'}});
  }

}
