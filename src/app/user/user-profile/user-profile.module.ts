import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserProfilePageRoutingModule } from './user-profile-routing.module';

import { UserProfilePage } from './user-profile.page';
import { ComponentsModule } from '../../components/components.module';
import { SocialComponentsModule } from '../../social/components/socialcomponents.module';
import { LeagueComponentsModule } from '../../league/components/leaguecomponents.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserProfilePageRoutingModule,
    ComponentsModule,
    SocialComponentsModule,
    LeagueComponentsModule

  ],
  declarations: [UserProfilePage]
})
export class UserProfilePageModule {}
