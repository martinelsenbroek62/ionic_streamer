import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LocalStoragePage } from './local-storage.page';

const routes: Routes = [
  {
    path: '',
    component: LocalStoragePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LocalStoragePageRoutingModule {}
