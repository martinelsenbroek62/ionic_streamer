import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LiveScoringListPage } from './live-scoring-list.page';

const routes: Routes = [
  {
    path: '',
    component: LiveScoringListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LiveScoringListPageRoutingModule {}
