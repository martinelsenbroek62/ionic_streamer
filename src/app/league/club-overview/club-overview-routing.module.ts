import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClubOverviewPage } from './club-overview.page';

const routes: Routes = [
  {
    path: '',
    component: ClubOverviewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClubOverviewPageRoutingModule {}
