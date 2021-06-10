import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BlogListPageRoutingModule } from './blog-list-routing.module';

import { BlogListPage } from './blog-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BlogListPageRoutingModule
  ],
  declarations: [BlogListPage]
})
export class BlogListPageModule {}
