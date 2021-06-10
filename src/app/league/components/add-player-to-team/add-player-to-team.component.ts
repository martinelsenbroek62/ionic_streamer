import { Component, Input, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { UtilityService } from 'src/app/chat/services/utility.service';
import { ScoringService } from 'src/app/scoring/services/scoring.service';
import { CcutilService } from 'src/app/services/ccutil.service';
import { LeagueService } from '../../services/league.service';

@Component({
  selector: 'app-add-player-to-team',
  templateUrl: './add-player-to-team.component.html',
  styleUrls: ['./add-player-to-team.component.scss'],
})
export class AddPlayerToTeamComponent implements OnInit {

  // Data passed in by componentProps
  @Input() teamsData: any;
  @Input() clubId: any;
  @Input() leagueId: any;

  public teamPlayerIds = [];
  public clubPlayers: any;
  public searchString: any;
  public selectedTeamPlayersId = [];
  public selectedTeamNewPlayersObject = [];
  public teamPlayers = [];
  teamNewPlayers = [];

  loadingPlayers = false;
  loadingSpinner = false;
  errorMessage: any;

  constructor(private utilityService: UtilityService, public modalController: ModalController, public ccUtil: CcutilService, private scoringService: ScoringService, private alertController: AlertController, private leagueService: LeagueService) { }

  ngOnInit() {
    // console.log(this.teamsData);
  }

  dismissModal() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss();
  }

  saveAndDismissModal() {
    // do save and then dismiss
    // prepare data to send to save
    const data = {
      teamId: this.teamsData.teamID,
      clubId: this.clubId,
      leagueId: this.leagueId,
      playerIds: this.selectedTeamPlayersId,
      newPlayers: this.selectedTeamNewPlayersObject
    }
    this.addPlayerToTeam(this.clubId, data, () => {
      // dismiss modal and by sending data as an arguments
      this.modalController.dismiss({
        reload: true
      });
    })
  }

  selectNewPlayers(index) {
    const indexFound = this.selectedTeamNewPlayersObject.indexOf(this.teamNewPlayers[index]);
    if (indexFound < 0) {
      // add player if not found in selected array
      this.selectedTeamNewPlayersObject.push(this.teamNewPlayers[index]);
    } else {
      // remove player if found in selected array
      this.selectedTeamNewPlayersObject.splice(indexFound, 1);
    }
  }

  selectExistingPlayers(index, playerId) {
    if (this.selectedTeamPlayersId.indexOf(playerId) < 0) {
      // add player if not found in selected array
      this.selectedTeamPlayersId.push(playerId);
    } else {
      // remove player if found in selected array
      this.selectedTeamPlayersId.splice(this.selectedTeamPlayersId.indexOf(playerId), 1);
    }
  }

  searchPlayersAPI(searchString) {
    // call an API
    this.loadingPlayers = true;
    // send teamId as '' (empty) so that all players could come in list to select for a team
    this.scoringService.getClubPlayers(this.clubId, '', searchString)
    .subscribe((value: any) => {
      // check response
      this.loadingPlayers = false;
      if (value.responseState && value.data) {
        this.clubPlayers = value.data;
      } else {
        console.log('Failed to call API');
      }
    }, (error) => {
      console.log('Api error');
      this.loadingPlayers = false;
      if(error.name == 'HttpErrorResponse')
        this.ccUtil.fail_modal('Please check your Network Connection');
      else
        this.ccUtil.fail_modal(error.message);
    });
  }

  async addNewPlayer() {
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
        // {
        //   name: 'phoneNumber',
        //   placeholder: 'Phone Number (Optional)'
        // }
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

              // add in new players list
              this.teamNewPlayers.push({ 'tempId': newPlayerId, "fName": data.firstName, "lName": data.lastName, "email": data.email,
              // "phoneNumber": data.phoneNumber 
              });
            }
          }
        }
      ]
    });
    addPlayer.present();
  }

  addPlayerToTeam(clubId, data, callback?) {
    // send data to server
    this.errorMessage = '';
    // show loader
    this.loadingSpinner = true;
    // call an API
    this.leagueService.addPlayerToTeam(clubId, data)
    .subscribe((value: any) => {
      // hide loader
      this.loadingSpinner = false;
      // check response
      if (value.responseState && value.data) {
        console.log('value', value);
        this.ccUtil.presentToast(value.data);
        // do callback
        if (callback) { callback(value.data) };
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
      if(error.name == 'HttpErrorResponse')
        this.ccUtil.fail_modal('Please check your Network Connection');
      else
        this.ccUtil.fail_modal(error.message);
    });
  }
}
