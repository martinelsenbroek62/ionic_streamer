import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LiveStreamingListPage } from './live-streaming-list.page';

const routes: Routes = [
  {
    path: '',
    component: LiveStreamingListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LiveStreamingListPageRoutingModule {}
