import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewsBlogDetailPage } from './news-blog-detail.page';

const routes: Routes = [
  {
    path: '',
    component: NewsBlogDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewsBlogDetailPageRoutingModule {}
