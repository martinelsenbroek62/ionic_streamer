import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TeamDetailsPage } from './team-details.page';

const routes: Routes = [
  {
    path: '',
    component: TeamDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TeamDetailsPageRoutingModule {}
