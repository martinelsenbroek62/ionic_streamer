import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CcutilService } from 'src/app/services/ccutil.service';
import { AlertController, ModalController } from '@ionic/angular';
import { UtilityService } from 'src/app/chat/services/utility.service';
import { ScoringService } from '../../services/scoring.service';

@Component({
  selector: 'app-remove-players',
  templateUrl: './remove-players.component.html',
  styleUrls: ['./remove-players.component.scss'],
})
export class RemovePlayersComponent implements OnInit, OnDestroy {

  // Data passed in by componentProps
  // get value of match details passed from live-scoring-list page
  @Input() players1: any;
  @Input() players2: any;
  @Input() teamOneName: any;
  @Input() teamTwoName: any;

  liveScoringTeams: any;
  errorMessage = '';
  loadingSpinner = false;
  selectedTeam1PlayersToRemove = [];
  selectedTeam2PlayersToRemove = [];

  constructor(private utilityService: UtilityService, public ccUtil: CcutilService, private alertController: AlertController, public modalController: ModalController) {
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  dismissModal() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss();
  }

  saveAndDismissModal() {
    this.modalController.dismiss({
      selectedTeam1PlayersToRemove: this.selectedTeam1PlayersToRemove,
      selectedTeam2PlayersToRemove: this.selectedTeam2PlayersToRemove,
    });
  }

  selectPlayers(playerId, teamNumber) {
    if (teamNumber === 1) {
      if (this.selectedTeam1PlayersToRemove.indexOf(playerId) < 0) {
        // add player if not found in selected array
        this.selectedTeam1PlayersToRemove.push(playerId);
      } else {
        // remove player if found in selected array
        this.selectedTeam1PlayersToRemove.splice(this.selectedTeam1PlayersToRemove.indexOf(playerId), 1);
      }
    } else if (teamNumber === 2) {
      if(this.selectedTeam2PlayersToRemove.indexOf(playerId) < 0) {
        // add player if not found in selected array
        this.selectedTeam2PlayersToRemove.push(playerId);
      } else {
        // remove player if found in selected array
        this.selectedTeam2PlayersToRemove.splice(this.selectedTeam2PlayersToRemove.indexOf(playerId), 1);
      }
    }
  }
}
