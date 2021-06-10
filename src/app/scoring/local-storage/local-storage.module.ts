import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LocalStoragePageRoutingModule } from './local-storage-routing.module';

import { LocalStoragePage } from './local-storage.page';

import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LocalStoragePageRoutingModule,
    ComponentsModule
  ],
  declarations: [LocalStoragePage]
})
export class LocalStoragePageModule {}
