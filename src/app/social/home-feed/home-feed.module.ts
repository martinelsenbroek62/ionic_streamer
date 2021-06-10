import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomeFeedPageRoutingModule } from './home-feed-routing.module';

import { HomeFeedPage } from './home-feed.page';
import { ComponentsModule } from '../../components/components.module';
import { SocialComponentsModule } from '../components/socialcomponents.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    HomeFeedPageRoutingModule,
    SocialComponentsModule
  ],
  declarations: [HomeFeedPage]
})
export class HomeFeedPageModule {}
