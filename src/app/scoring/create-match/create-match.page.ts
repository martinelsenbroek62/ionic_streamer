import { Component, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CcutilService } from 'src/app/services/ccutil.service';
import { ScoringService } from '../services/scoring.service';
import { AlertController, ModalController } from '@ionic/angular';
import { UtilityService } from 'src/app/chat/services/utility.service';
import { AddPlayersClubComponent } from '../modals/add-players-club/add-players-club.component';

@Component({
  selector: 'app-create-match',
  templateUrl: './create-match.page.html',
  styleUrls: ['./create-match.page.scss'],
})
export class CreateMatchPage implements OnInit, OnDestroy {

  // Data passed in by componentProps
  // get value of match details passed from live-scoring-list page
  @Input() matchData: any;

  continueToCreateMatch: boolean;
  liveScoringTeams: any;
  errorMessage = '';
  loadingSpinner = false;
  selectedTeam1Players = [];
  selectedTeam2Players = [];

  team1NewPlayers = [];
  team2NewPlayers = [];
  teamOneCaptain: any;
  teamTwoCaptain: any;
  oversArray = [];
  gameMaxOvers: any;
  disableCreateMatch = false;
  resolve: any;

  constructor(private utilityService: UtilityService, private router: Router, private route: ActivatedRoute, public ccUtil: CcutilService, private scoringService: ScoringService, private alertController: AlertController, public modalController: ModalController) {
    // set max number of overs to display
    for (let i=1; i<101; i++) {
      this.oversArray.push(i);
    }
  }

  ngOnInit() {
    // to close modal on click to hardware back button
    // https://dev.to/nicolus/closing-a-modal-with-the-back-button-in-ionic-5-angular-9-50pk
    const modalState = {
      modal : true,
      desc : 'fake state for our modal'
    };
    history.pushState(modalState, null);

    // get Match Creation Details
    if (this.matchData) {
      this.getLiveScoringTeamsForLiveMatchCreation(this.matchData);
    }
  }

  ngOnDestroy() {
    // to close modal on click to hardware back button
    if (window.history.state.modal) {
      history.back();
    }
  }

  // to close modal on click to hardware back button
  @HostListener('window:popstate', ['$event'])
  dismissModal() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      reload: false
    });
  }

  getMatchType(matchType) {
    return this.ccUtil.getMatchType(matchType);
  }

  getSeriesType(seriesType) {
    return this.ccUtil.getSeriesType(seriesType);
  }

  getLiveScoringTeamsForLiveMatchCreation(matchData) {
    this.liveScoringTeams = [];
    this.errorMessage = '';
    // show loader
    this.loadingSpinner = true;
    // call an API
    this.scoringService.getLiveScoringTeamsForLiveMatchCreation(matchData.clubId, matchData.fixtureId)
    .subscribe((value: any) => {
      // hide loader
      this.loadingSpinner = false;
      // check response
      if (value.responseState && value.data) {
        // get match details
        this.liveScoringTeams = value.data;
        console.log('liveScoringTeams', this.liveScoringTeams);
        // set teamOneCaptain and teamTwoCaptain - to set in select box ngModel
        // without local variable default select of ion-select won't works
        this.teamOneCaptain = String(this.liveScoringTeams.teamOneCaptain);
        this.teamTwoCaptain = String(this.liveScoringTeams.teamTwoCaptain);
        this.gameMaxOvers = this.liveScoringTeams.maxOvers;
      } else {
        console.log('Failed to call API');
        if(value.errorMessage){
          this.errorMessage = value.errorMessage;
        }
      }
    }, (error) => {
      // hide loader
      this.loadingSpinner = false;
      console.log('Api error');
      if(error.name === 'HttpErrorResponse')
        this.ccUtil.fail_modal('Please check your Network Connection');
      else
        this.ccUtil.fail_modal(error.message);
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

  async actionAddPlayersFromClub() {
    const modal = await this.modalController.create({
      component: AddPlayersClubComponent,
      cssClass: '',
      componentProps: {
        teamsData: {
          clubId: this.matchData.clubId,
          teamOneName: this.liveScoringTeams.teamOneName,
          teamTwoName: this.liveScoringTeams.teamTwoName,
          teamOne: this.liveScoringTeams.teamOne,
          teamTwo: this.liveScoringTeams.teamTwo
        }
      }
    });
    await modal.present();

    const resp: any = await modal.onDidDismiss();
    if (resp && resp.data) {
      if (resp.data.selectedTeam1PlayersObject) {
        resp.data.selectedTeam1PlayersObject.forEach(player => {
          if (!this.liveScoringTeams.teamOnePlayers[player.playerID]) {
            // if not found add
            this.liveScoringTeams.teamOnePlayers[player.playerID] = player;
          }
          if (this.selectedTeam1Players.indexOf(player.playerID) == -1) {
            this.selectedTeam1Players.push(player.playerID);
          }
        });
      }
      if (resp.data.selectedTeam2PlayersObject) {
        resp.data.selectedTeam2PlayersObject.forEach(player => {
          if (!this.liveScoringTeams.teamTwoPlayers[player.playerID]) {
            // if not found add
            this.liveScoringTeams.teamTwoPlayers[player.playerID] = player;
          }
          if (this.selectedTeam2Players.indexOf(player.playerID) == -1) {
            this.selectedTeam2Players.push(player.playerID);
          }
        });
      }
    }
  }

  removeClubPlayer(playerId, teamNumber){
    // if (teamNumber == 1) {
    //   this.team1ClubPlayers.splice(this.team1ClubPlayers.indexOf(playerId), 1);
    //   this.selectedTeam1Players.splice(this.selectedTeam1Players.indexOf(playerId), 1);
    //   this.team1PlayersCount = this.team1PlayersCount - 1;
    // } else if (teamNumber == 2) {
    //   this.team2ClubPlayers.splice(this.team2ClubPlayers.indexOf(playerId), 1);
    //   this.selectedTeam2Players.splice(this.selectedTeam2Players.indexOf(playerId), 1);
    //   this.team2PlayersCount = this.team2PlayersCount - 1;
    // }
  }

  createMatch() {
    // create new match with selected players and captain of both the teams
    this.disableCreateMatch = true;

    let team1Players = [];
    let team2Players = [];

    if(this.liveScoringTeams.teamOnePlayingXI.length > 0) {
      team1Players = this.liveScoringTeams.teamOnePlayingXI;
    } else {
      team1Players = this.selectedTeam1Players;
    }

    if(this.liveScoringTeams.teamTwoPlayingXI.length > 0) {
      team2Players = this.liveScoringTeams.teamTwoPlayingXI;
    } else {
      team2Players = this.selectedTeam2Players;
    }

    let isTeam1CaptainNew = false;
    let isTeam2CaptainNew = false;
    // check if captain changed and choosen from team1NewPlayers
    if (this.team1NewPlayers.findIndex((o) => o.newPlayerId == this.teamOneCaptain) > -1) {
      isTeam1CaptainNew = true;
    }
    // check if captain changed and choosen from team2NewPlayers
    if (this.team2NewPlayers.findIndex((o) => o.newPlayerId == this.teamTwoCaptain) > -1) {
      isTeam2CaptainNew = true;
    }

    // create data object to send to server to create live scoring teams
    const liveScoringData = {
      team1Id : this.liveScoringTeams.teamOne,
      team2Id : this.liveScoringTeams.teamTwo,
      isTeam1CaptainNew,
      isTeam2CaptainNew,
      team1Captain : Number(this.teamOneCaptain),
      team2Captain : Number(this.teamTwoCaptain),
      team1Players,
      team2Players,
      overs: this.gameMaxOvers,
      team1NewPlayers : this.team1NewPlayers,
      team2NewPlayers : this.team2NewPlayers
    };

    // show loader
    this.loadingSpinner = true;

    // call an API
    this.scoringService.createLiveMatch(this.matchData.clubId, this.matchData.fixtureId, liveScoringData)
    .subscribe((value: any) => {
      // hide loader
      this.loadingSpinner = false;
      this.disableCreateMatch = false;
      // check response
      if (value.responseState && value.data) {
        // call a resolve function to pass data to reload data in the match list
        // so that match moved from ready to score TO my games
        this.modalController.dismiss({
          reload: true
        });
      } else {
        console.log('Failed to call API');
        this.ccUtil.showError('Oops!!!', 'Something went wrong, Please try again later.');
      }
    }, (error) => {
      // hide loader
      this.loadingSpinner = false;
      this.disableCreateMatch = false;
      console.log('Api error');
      if(error.name === 'HttpErrorResponse')
        this.ccUtil.fail_modal('Please check your Network Connection');
      else
        this.ccUtil.fail_modal(error.message);
    });
  }
}
