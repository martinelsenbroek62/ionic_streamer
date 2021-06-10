import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddPlayersClubComponent } from './add-players-club/add-players-club.component';
import { AddCommentComponent } from './add-comment/add-comment.component';
import { SelectPredefinedCommentsComponent } from './select-predefined-comments/select-predefined-comments.component';
import { TossComponent } from './toss/toss.component';
import { SelectPlayerComponent } from './select-player/select-player.component';
import { ActionsComponent } from './actions/actions.component';
import { WicketsComponent } from './wickets/wickets.component';
import { WidesComponent } from './wides/wides.component';
import { NoballsComponent } from './noballs/noballs.component';
import { ExtrasComponent } from './extras/extras.component';
import { EditBallsComponent } from './edit-balls/edit-balls.component';
import { AddPlayersComponent } from './add-players/add-players.component';
import { PitchmapDirectionsComponent } from './pitchmap-directions/pitchmap-directions.component';
import { AddballComponent } from './addball/addball.component';
import { RemovePlayersComponent } from './remove-players/remove-players.component';
import { DlsChartPageComponent } from './dls-chart-page/dls-chart-page.component';
import { ManOfTheMatchComponent } from './man-of-the-match/man-of-the-match.component';
// import { CompareTeamDisplayTemplateComponent } from '../contests/compare-team-display-template/compare-team-display-template.component';


@NgModule({
  declarations: [
    AddPlayersClubComponent,
    AddCommentComponent,
    SelectPredefinedCommentsComponent,
    TossComponent,
    SelectPlayerComponent,
    ActionsComponent,
    WidesComponent,
    WicketsComponent,
    NoballsComponent,
    ExtrasComponent,
    EditBallsComponent,
    AddPlayersComponent,
    PitchmapDirectionsComponent,
    AddballComponent,
    AddPlayersComponent,
    RemovePlayersComponent,
    DlsChartPageComponent,
    ManOfTheMatchComponent
  ],
  imports: [
    IonicModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [
    AddPlayersClubComponent,
    AddCommentComponent,
    SelectPredefinedCommentsComponent,
    TossComponent,
    SelectPlayerComponent,
    ActionsComponent,
    WidesComponent,
    WicketsComponent,
    NoballsComponent,
    ExtrasComponent,
    EditBallsComponent,
    AddPlayersComponent,
    PitchmapDirectionsComponent,
    AddballComponent,
    AddPlayersComponent,
    RemovePlayersComponent,
    DlsChartPageComponent,
    ManOfTheMatchComponent
  ]
})
export class ScoringModalsModule {}
