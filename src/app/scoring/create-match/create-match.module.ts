import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateMatchPageRoutingModule } from './create-match-routing.module';

import { CreateMatchPage } from './create-match.page';
import { ScoringModalsModule } from '../modals/scoring-modals.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateMatchPageRoutingModule,
    ScoringModalsModule
  ],
  declarations: [CreateMatchPage]
})
export class CreateMatchPageModule {}
