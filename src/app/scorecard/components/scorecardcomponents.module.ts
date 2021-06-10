import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InfoComponent } from './info/info.component';
import { LiveComponent } from './live/live.component';
import { ScorecardComponent } from './scorecard/scorecard.component';
import { HighlightsComponent } from './highlights/highlights.component';
import { AnalysisComponent } from './analysis/analysis.component';
import { ScorecardTeamScoresComponent } from './scorecard-team-scores/scorecard-team-scores.component';
import { MatchesComponent } from '../../league/components/matches/matches.component';
import { BallByBallInningsComponent } from './ball-by-ball-innings/ball-by-ball-innings.component';

@NgModule({
  declarations: [
    InfoComponent,
    MatchesComponent,
    AnalysisComponent,
    HighlightsComponent,
    LiveComponent,
    ScorecardComponent,
    ScorecardTeamScoresComponent,
    BallByBallInningsComponent
  ],
  imports: [
    IonicModule,
    FormsModule,
    CommonModule],
  exports: [
    InfoComponent,
    MatchesComponent,
    AnalysisComponent,
    HighlightsComponent,
    LiveComponent,
    ScorecardComponent,
    ScorecardTeamScoresComponent,
    BallByBallInningsComponent
  ]
})
export class ScorecardComponentsModule {}
