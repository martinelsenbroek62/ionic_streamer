import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SeriesDetailsPage } from './series-details.page';

const routes: Routes = [
  {
    path: '',
    component: SeriesDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SeriesDetailsPageRoutingModule {}
