import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ScoringPage } from './scoring.page';

const routes: Routes = [
  {
    path: '',
    component: ScoringPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScoringPageRoutingModule {}
