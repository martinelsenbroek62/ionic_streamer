import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ImageVideoInfoPage } from './image-video-info.page';

const routes: Routes = [
  {
    path: '',
    component: ImageVideoInfoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ImageVideoInfoPageRoutingModule {}
