import { NgModule } from "@angular/core";
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatchesComponent } from './matches/matches.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { AlbumsComponent } from './albums/albums.component';
import { AlbumDetailsComponent } from './album-details/album-details.component';
import { FinalizeTeamComponent } from "../modals/finalize-team/finalize-team.component";
import { TeamAvailabilityComponent } from "../modals/team-availability/team-availability.component";
import { InternationalNewsComponent } from "./international-news/international-news.component";
import { CreateUpdateTeamComponent } from '../modals/create-update-team/create-update-team.component';
import { CreateUpdateSeriesComponent } from '../modals/create-update-series/create-update-series.component';
import { AddPlayerToTeamComponent } from './add-player-to-team/add-player-to-team.component';

@NgModule({
  declarations: [
    MatchesComponent,
    ScheduleComponent,
    AlbumsComponent,
    AlbumDetailsComponent,
    FinalizeTeamComponent,
    TeamAvailabilityComponent,
    InternationalNewsComponent,
    CreateUpdateTeamComponent,
    CreateUpdateSeriesComponent,
    AddPlayerToTeamComponent
  ],
  imports: [
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule],
  exports: [
    MatchesComponent,
    ScheduleComponent,
    AlbumsComponent,
    AlbumDetailsComponent,
    FinalizeTeamComponent,
    TeamAvailabilityComponent,
    InternationalNewsComponent,
    CreateUpdateTeamComponent,
    CreateUpdateSeriesComponent,
    AddPlayerToTeamComponent
  ]
})
export class LeagueComponentsModule {}
