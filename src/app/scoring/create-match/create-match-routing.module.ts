import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateMatchPage } from './create-match.page';

const routes: Routes = [
  {
    path: '',
    component: CreateMatchPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateMatchPageRoutingModule {}
