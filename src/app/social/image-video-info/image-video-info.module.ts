import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ImageVideoInfoPageRoutingModule } from './image-video-info-routing.module';

import { ImageVideoInfoPage } from './image-video-info.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ImageVideoInfoPageRoutingModule
  ],
  declarations: [ImageVideoInfoPage]
})
export class ImageVideoInfoPageModule {}
