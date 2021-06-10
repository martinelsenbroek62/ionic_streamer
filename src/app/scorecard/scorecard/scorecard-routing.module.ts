import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ScorecardPage } from './scorecard.page';

const routes: Routes = [
  {
    path: '',
    component: ScorecardPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScorecardPageRoutingModule {}
