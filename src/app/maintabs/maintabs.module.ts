import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MaintabsPageRoutingModule } from './maintabs-routing.module';

import { MaintabsPage } from './maintabs.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MaintabsPageRoutingModule
  ],
  declarations: [MaintabsPage]
})
export class MaintabsPageModule {}
