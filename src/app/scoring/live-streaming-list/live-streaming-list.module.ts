import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LiveStreamingListPageRoutingModule } from './live-streaming-list-routing.module';

import { LiveStreamingListPage } from './live-streaming-list.page';
import { ScoringComponentsModule } from '../components/scoringcomponents.module';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ScoringComponentsModule,
    ComponentsModule,
    LiveStreamingListPageRoutingModule
  ],
  declarations: [LiveStreamingListPage]
})
export class LiveStreamingListPageModule {}
