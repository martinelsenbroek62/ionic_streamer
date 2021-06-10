import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StartStreamingPageRoutingModule } from './start-streaming-routing.module';

import { StartStreamingPage } from './start-streaming.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StartStreamingPageRoutingModule
  ],
  declarations: [StartStreamingPage]
})
export class StartStreamingPageModule {}
