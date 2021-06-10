import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CcutilService } from 'src/app/services/ccutil.service';
import { AlertController, ModalController } from '@ionic/angular';
import { UtilityService } from 'src/app/chat/services/utility.service';
import { ScoringService } from '../../services/scoring.service';

@Component({
  selector: 'app-add-players',
  templateUrl: './add-players.component.html',
  styleUrls: ['./add-players.component.scss'],
})
export class AddPlayersComponent implements OnInit, OnDestroy {

  // Data passed in by componentProps
  // get value of match details passed from live-scoring-list page
  @Input() nonPlayingPlayers1: any;
  @Input() nonPlayingPlayers2: any;
  @Input() teamOneName: any;
  @Input() teamTwoName: any;

  liveScoringTeams: any;
  errorMessage = '';
  loadingSpinner = false;
  selectedTeam1Players = [];
  selectedTeam2Players = [];

  team1NewPlayers = [];
  team2NewPlayers = [];

  constructor(private utilityService: UtilityService, public ccUtil: CcutilService, private scoringService: ScoringService, private alertController: AlertController, public modalController: ModalController) {
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
      selectedTeam1Players: this.selectedTeam1Players,
      selectedTeam2Players: this.selectedTeam2Players,
      team1NewPlayers: this.team1NewPlayers,
      team2NewPlayers: this.team2NewPlayers
    });
  }

  selectPlayers(playerId, teamNumber) {
    if (teamNumber === 1) {
      if (this.selectedTeam1Players.indexOf(playerId) < 0) {
        // add player if not found in selected array
        this.selectedTeam1Players.push(playerId);
      } else {
        // remove player if found in selected array
        this.selectedTeam1Players.splice(this.selectedTeam1Players.indexOf(playerId), 1);
      }
    } else if (teamNumber === 2) {
      if(this.selectedTeam2Players.indexOf(playerId) < 0) {
        // add player if not found in selected array
        this.selectedTeam2Players.push(playerId);
      } else {
        // remove player if found in selected array
        this.selectedTeam2Players.splice(this.selectedTeam2Players.indexOf(playerId), 1);
      }
    }
  }

  async addNewPlayer(teamNumber) {
    const addPlayer = await this.alertController.create({
      header: 'Add New Player',
      backdropDismiss: false,
      inputs: [
        {
          name: 'firstName',
          placeholder: '*FirstName'
        },
        {
          name: 'lastName',
          placeholder: '*LastName'
        },
        {
          name: 'email',
          placeholder: 'Email (Optional)'
        },
        {
          name: 'phoneNumber',
          placeholder: 'Phone Number (Optional)'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: ()=>{
          }
        },
        {
          text: 'Save',
          handler: (data: any) => {
            const fname= data.firstName;
            const wsfname =fname.replace(/ /g, '');
            const fnameLength=wsfname.length;

            const lname= data.lastName;
            const wslname =lname.replace(/ /g, '');
            const lnameLength=wslname.length;
            const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

            if (data.firstName === '' || data.lastName === '') {
              this.utilityService.presentToast('Please enter First Name and Last Name');
              return false;
            } else if(fnameLength === 0 || lnameLength === 0 ) {
              this.utilityService.presentToast('Please enter valid First Name and Last Name');
              return false;
            } else if(data.email && (!re.test(data.email.toLowerCase()))) {
              this.utilityService.presentToast('Please enter valid Email');
              return false;
            } else {
              // get timestamp to create new player id
              const d = new Date();
              const newPlayerId = d.valueOf();
              // get player name
              const playerName = data.firstName + ' ' + data.lastName;

              if (teamNumber === 'team1') {
                // add in team1 new players list
                this.team1NewPlayers.push({ 'newPlayerId': newPlayerId, "firstName": data.firstName, "lastName": data.lastName, "email": data.email, "phoneNumber": data.phoneNumber });
                // // set recent added player as checked
                // const teamOnePlayersIdElem = document.getElementById('teamOnePlayersId');
                // console.log(teamOnePlayersIdElem);
              } else {
                this.team2NewPlayers.push({ 'newPlayerId': newPlayerId, "firstName": data.firstName, "lastName": data.lastName, "email": data.email, "phoneNumber": data.phoneNumber });
              }
            }
          }
        }
      ]
    });
    addPlayer.present();
  }
}
