import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClubOverviewPageRoutingModule } from './club-overview-routing.module';

import { ClubOverviewPage } from './club-overview.page';
import { ComponentsModule } from '../../components/components.module';
import { SocialComponentsModule } from '../../social/components/socialcomponents.module';
import { LeagueComponentsModule } from '../components/leaguecomponents.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ClubOverviewPageRoutingModule,
    ComponentsModule,
    SocialComponentsModule,
    LeagueComponentsModule
  ],
  declarations: [ClubOverviewPage]
})
export class ClubOverviewPageModule {}
