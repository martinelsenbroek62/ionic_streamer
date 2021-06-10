import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SeriesDetailsPageRoutingModule } from './series-details-routing.module';

import { SeriesDetailsPage } from './series-details.page';
import { LeagueComponentsModule } from '../components/leaguecomponents.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SeriesDetailsPageRoutingModule,
    LeagueComponentsModule
  ],
  declarations: [SeriesDetailsPage]
})
export class SeriesDetailsPageModule {}
