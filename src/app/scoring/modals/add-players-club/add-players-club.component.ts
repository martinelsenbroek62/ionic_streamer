import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CcutilService } from 'src/app/services/ccutil.service';
import { ScoringService } from '../../services/scoring.service';

@Component({
  selector: 'app-add-players-club',
  templateUrl: './add-players-club.component.html',
  styleUrls: ['./add-players-club.component.scss'],
})
export class AddPlayersClubComponent implements OnInit {

  // Data passed in by componentProps
  @Input() teamsData: any;

  public team1PlayerIds = [];
  public team2PlayerIds = [];
  public clubPlayers1: any;
  public clubPlayers2: any;
  public searchString1: any;
  public searchString2: any;
  public selectedTeam1Players = [];
  public selectedTeam2Players = [];
  public selectedTeam1PlayersObject = [];
  public selectedTeam2PlayersObject = [];
  public team1Players = [];
  public team2Players = [];

  constructor(public modalController: ModalController, public ccUtil: CcutilService, private scoringService: ScoringService) { }

  ngOnInit() {
    console.log(this.teamsData);
  }

  dismissModal() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss();
  }

  saveAndDismissModal() {
    // check and make sure selected players are in existing clubPlayers1 and clubPlayers2 list because these list refreshed on each search keyword
    for (const playerId of this.selectedTeam1Players) {
      const player = this.clubPlayers1.find((o) => o.playerID == playerId);
      if (!player) {
        // if player not found in clubPlayers1 list means search results changed - so remove this player from selectedTeam1Players and selectedTeam1PlayersObject
        // remove player if found in selected array
        this.selectedTeam1Players.splice(this.selectedTeam1Players.indexOf(playerId), 1);
        // push player object will required in create-match page
        this.selectedTeam1PlayersObject.splice(this.selectedTeam1PlayersObject.indexOf(player), 1);
      }
    }
    // dismiss modal and by sending data as an arguments
    this.modalController.dismiss({
      selectedTeam1Players: this.selectedTeam1Players,
      selectedTeam2Players: this.selectedTeam2Players,
      // player object will required in create-match page
      selectedTeam1PlayersObject: this.selectedTeam1PlayersObject,
      selectedTeam2PlayersObject: this.selectedTeam2PlayersObject
    });
  }

  selectPlayers(index, playerId, teamNumber) {
    if (teamNumber === 1) {
      if (this.selectedTeam1Players.indexOf(playerId) < 0) {
        // add player if not found in selected array
        this.selectedTeam1Players.push(playerId);
        // push player object will required in create-match page
        this.selectedTeam1PlayersObject.push(this.clubPlayers1[index]);
      } else {
        // remove player if found in selected array
        this.selectedTeam1Players.splice(this.selectedTeam1Players.indexOf(playerId), 1);
        // push player object will required in create-match page
        this.selectedTeam1PlayersObject.splice(this.selectedTeam1PlayersObject.indexOf(this.clubPlayers1[index]), 1);
      }
    } else if (teamNumber === 2) {
      if (this.selectedTeam2Players.indexOf(playerId) < 0) {
        // add player if not found in selected array
        this.selectedTeam2Players.push(playerId);
        // push player object will required in create-match page
        this.selectedTeam2PlayersObject.push(this.clubPlayers2[index]);
      } else {
        // remove player if found in selected array
        this.selectedTeam2Players.splice(this.selectedTeam2Players.indexOf(playerId), 1);
        // push player object will required in create-match page
        this.selectedTeam2PlayersObject.splice(this.selectedTeam2PlayersObject.indexOf(this.clubPlayers2[index]), 1);
      }
    }
  }

  searchClubPlayers(teamId, teamNumber) {
    console.log(teamId);
    if (teamNumber === 1) {
      // searchString1
      this.searchPlayersAPI(teamId, teamNumber, this.searchString1);
    } else {
      // searchString2
      this.searchPlayersAPI(teamId, teamNumber, this.searchString2);
    }
  }

  searchPlayersAPI(teamId, teamNumber, searchString) {
    // call an API
    this.scoringService.getClubPlayers(this.teamsData.clubId, teamId, searchString)
    .subscribe((value: any) => {
      // check response
      if (value.responseState && value.data) {
        if (teamNumber === 1) {
          this.clubPlayers1 = value.data;
        } else if (teamNumber === 2) {
          this.clubPlayers2 = value.data;
        }
      } else {
        console.log('Failed to call API');
      }
    }, (error) => {
      console.log('Api error');
      if(error.name == 'HttpErrorResponse')
        this.ccUtil.fail_modal('Please check your Network Connection');
      else
        this.ccUtil.fail_modal(error.message);
    });
  }

}
