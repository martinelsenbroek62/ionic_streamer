import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InternationalPageRoutingModule } from './international-routing.module';

import { InternationalPage } from './international.page';
import { ComponentsModule } from '../../components/components.module';
import { SocialComponentsModule } from '../../social/components/socialcomponents.module';
import { LeagueComponentsModule } from '../components/leaguecomponents.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InternationalPageRoutingModule,
    SocialComponentsModule,
    LeagueComponentsModule,
    ComponentsModule
  ],
  declarations: [InternationalPage]
})
export class InternationalPageModule {}
