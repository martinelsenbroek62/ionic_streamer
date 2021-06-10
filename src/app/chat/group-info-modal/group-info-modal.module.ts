import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GroupInfoModalPageRoutingModule } from './group-info-modal-routing.module';

import { GroupInfoModalPage } from './group-info-modal.page';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GroupInfoModalPageRoutingModule,
    Ng2SearchPipeModule
  ],
  declarations: [GroupInfoModalPage]
})
export class GroupInfoModalPageModule {}
