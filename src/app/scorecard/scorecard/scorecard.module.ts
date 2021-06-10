import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ScorecardPageRoutingModule } from './scorecard-routing.module';

import { ScorecardPage } from './scorecard.page';
import { ScorecardComponentsModule } from '../components/scorecardcomponents.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ScorecardPageRoutingModule,
    ScorecardComponentsModule
  ],
  declarations: [ScorecardPage]
})
export class ScorecardPageModule {}
