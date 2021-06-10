import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewsListPageRoutingModule } from './news-list-routing.module';

import { NewsListPage } from './news-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewsListPageRoutingModule
  ],
  declarations: [NewsListPage]
})
export class NewsListPageModule {}
