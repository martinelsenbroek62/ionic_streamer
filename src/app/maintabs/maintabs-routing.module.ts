import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MaintabsPage } from './maintabs.page';



const routes: Routes = [
  {
    path: '',
    component: MaintabsPage,
    children: [
      {
        path: 'homefeed',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../social/home-feed/home-feed.module').then(m => m.HomeFeedPageModule)
          }
        ]
      },
      {
        path: 'mygames',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../league/my-games/my-games.module').then(m => m.MyGamesPageModule)
          }
        ]
      },
      {
        path: 'chat',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../chat/chat/chat.module').then(m => m.ChatPageModule)
          }
        ]
      },
      {
        path: 'international',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../league/international/international.module').then(m => m.InternationalPageModule)
          }
        ]
      },
      {
        path: 'menu',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../menu/menu.module').then(m => m.MenuPageModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: '/maintabs/mygames',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/maintabs/mygames',
    pathMatch: 'full'
  }
  ];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MaintabsPageRoutingModule {}
