import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LiveScoringListPageRoutingModule } from './live-scoring-list-routing.module';

import { LiveScoringListPage } from './live-scoring-list.page';
import { ScoringComponentsModule } from '../components/scoringcomponents.module';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ScoringComponentsModule,
    ComponentsModule,
    LiveScoringListPageRoutingModule
  ],
  declarations: [LiveScoringListPage]
})
export class LiveScoringListPageModule {}
