import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GroupInfoModalPage } from './group-info-modal.page';

const routes: Routes = [
  {
    path: '',
    component: GroupInfoModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GroupInfoModalPageRoutingModule {}
