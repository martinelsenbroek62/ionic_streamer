import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LocalStorageDetailsPageRoutingModule } from './local-storage-details-routing.module';

import { LocalStorageDetailsPage } from './local-storage-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LocalStorageDetailsPageRoutingModule
  ],
  declarations: [LocalStorageDetailsPage]
})
export class LocalStorageDetailsPageModule {}
