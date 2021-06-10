import { NgModule } from "@angular/core";
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { MatchListComponent } from './match-list/match-list.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    MatchListComponent
  ],
  imports: [
    IonicModule,
    FormsModule,
    CommonModule],
  exports: [
    MatchListComponent
  ]
})
export class ScoringComponentsModule {}
