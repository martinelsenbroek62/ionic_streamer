import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AlbumListPage } from './album-list.page';

const routes: Routes = [
  {
    path: '',
    component: AlbumListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AlbumListPageRoutingModule {}
