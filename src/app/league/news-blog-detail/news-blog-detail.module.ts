import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewsBlogDetailPageRoutingModule } from './news-blog-detail-routing.module';

import { NewsBlogDetailPage } from './news-blog-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewsBlogDetailPageRoutingModule
  ],
  declarations: [NewsBlogDetailPage]
})
export class NewsBlogDetailPageModule {}
