import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AlbumListPageRoutingModule } from './album-list-routing.module';

import { AlbumListPage } from './album-list.page';

import { LeagueComponentsModule } from '../components/leaguecomponents.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AlbumListPageRoutingModule,
    LeagueComponentsModule
  ],
  declarations: [AlbumListPage]
})
export class AlbumListPageModule {}
