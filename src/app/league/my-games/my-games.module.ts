import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyGamesPageRoutingModule } from './my-games-routing.module';

import { MyGamesPage } from './my-games.page';
import { ComponentsModule } from '../../components/components.module';
import { LeagueComponentsModule } from '../components/leaguecomponents.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    LeagueComponentsModule,
    MyGamesPageRoutingModule
  ],
  declarations: [MyGamesPage]
})
export class MyGamesPageModule {}
