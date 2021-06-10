import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FriendsListPage } from './friends-list.page';

const routes: Routes = [
  {
    path: '',
    component: FriendsListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FriendsListPageRoutingModule {}
