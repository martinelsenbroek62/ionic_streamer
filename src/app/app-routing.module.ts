import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthguardGuard } from './authguard.guard';
import { AnonymousGuardService } from './services/anonymous-guard.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'maintabs',
    loadChildren: () => import('./maintabs/maintabs.module').then( m => m.MaintabsPageModule),
    // canActivate:[AuthguardGuard]
  },
  {
    path: 'menu',
    loadChildren: () => import('./menu/menu.module').then( m => m.MenuPageModule),
    canActivate:[AuthguardGuard]
  },
  {
    path: 'login',
    loadChildren: () => import('./user/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'group-info-modal',
    loadChildren: () => import('./chat/group-info-modal/group-info-modal.module').then( m => m.GroupInfoModalPageModule)
  },
  {
    path: 'live-scoring-list',
    loadChildren: () => import('./scoring/live-scoring-list/live-scoring-list.module').then( m => m.LiveScoringListPageModule)
  },
  {
    path: 'live-streaming-list',
    loadChildren: () => import('./scoring/live-streaming-list/live-streaming-list.module').then( m => m.LiveStreamingListPageModule)
  },
  {
    path: 'my-games',
    loadChildren: () => import('./league/my-games/my-games.module').then( m => m.MyGamesPageModule)
  },
  {
    path: 'start-streaming',
    loadChildren: () => import('./scoring/start-streaming/start-streaming.module').then( m => m.StartStreamingPageModule)
  },
  {
    path: 'home-feed',
    loadChildren: () => import('./social/home-feed/home-feed.module').then( m => m.HomeFeedPageModule)
  },
  {
    path: 'create-post',
    loadChildren: () => import('./social/create-post/create-post.module').then( m => m.CreatePostPageModule)
  },
  {
    path: 'friends-list',
    loadChildren: () => import('./social/friends-list/friends-list.module').then( m => m.FriendsListPageModule)
  },
  {
    path: 'create-match',
    loadChildren: () => import('./scoring/create-match/create-match.module').then( m => m.CreateMatchPageModule)
  },
  {
    path: 'image-video-info',
    loadChildren: () => import('./social/image-video-info/image-video-info.module').then( m => m.ImageVideoInfoPageModule)
  },
  {
    path: 'post-details',
    loadChildren: () => import('./social/post-details/post-details.module').then( m => m.PostDetailsPageModule)
  },
  {
    path: 'club-overview',
    loadChildren: () => import('./league/club-overview/club-overview.module').then( m => m.ClubOverviewPageModule)
  },
  {
    path: 'scoring',
    loadChildren: () => import('./scoring/scoring/scoring.module').then( m => m.ScoringPageModule)
  },
  {
    path: 'player-stats',
    loadChildren: () => import('./league/player-stats/player-stats.module').then( m => m.PlayerStatsPageModule)
  },
  {
    path: 'album-list',
    loadChildren: () => import('./league/album-list/album-list.module').then( m => m.AlbumListPageModule)
  },
  {
    path: 'scorecard',
    loadChildren: () => import('./scorecard/scorecard/scorecard.module').then( m => m.ScorecardPageModule)
  },
  {
    path: 'user-profile',
    loadChildren: () => import('./user/user-profile/user-profile.module').then( m => m.UserProfilePageModule)
  },
  {
    path: 'international',
    loadChildren: () => import('./league/international/international.module').then( m => m.InternationalPageModule)
  },
  {
    path: 'notifications',
    loadChildren: () => import('./league/notifications/notifications.module').then( m => m.NotificationsPageModule)
  },
  {
    path: 'news-list',
    loadChildren: () => import('./league/news-list/news-list.module').then( m => m.NewsListPageModule)
  },
  {
    path: 'blog-list',
    loadChildren: () => import('./league/blog-list/blog-list.module').then( m => m.BlogListPageModule)
  },
  {
    path: 'news-blog-detail',
    loadChildren: () => import('./league/news-blog-detail/news-blog-detail.module').then( m => m.NewsBlogDetailPageModule)
  },
  {
    path: 'search',
    loadChildren: () => import('./league/search/search.module').then( m => m.SearchPageModule)
  },
  {
    path: 'local-storage',
    loadChildren: () => import('./scoring/local-storage/local-storage.module').then( m => m.LocalStoragePageModule)
  },
  {
    path: 'local-storage-details',
    loadChildren: () => import('./scoring/local-storage-details/local-storage-details.module').then( m => m.LocalStorageDetailsPageModule)
  },
  {
    path: 'otp',
    loadChildren: () => import('./user/otp/otp.module').then( m => m.OTPPageModule)
  },
  {
    path: 'team-details',
    loadChildren: () => import('./league/team-details/team-details.module').then( m => m.TeamDetailsPageModule)
  },
  {
    path: 'series-details',
    loadChildren: () => import('./league/series-details/series-details.module').then( m => m.SeriesDetailsPageModule)
  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
