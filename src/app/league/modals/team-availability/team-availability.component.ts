import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CcutilService } from 'src/app/services/ccutil.service';
import { LeagueService } from '../../services/league.service';
import { FinalizeTeamComponent } from '../finalize-team/finalize-team.component';

@Component({
  selector: 'app-team-availability',
  templateUrl: './team-availability.component.html',
  styleUrls: ['./team-availability.component.scss'],
})
export class TeamAvailabilityComponent implements OnInit {
  @Input() schedule: any;

  loadingSpinner: any;
  playersList: any;
  playerRadio: any;

  constructor(private modalController: ModalController, private leagueService: LeagueService, 
    public ccUtil: CcutilService) { }

  ngOnInit() {
    this.getTeamPlayers();
  }

  dismissModal() {
    // using the injected ModalController this page
    // can 'dismiss' itself and optionally pass back data
    this.modalController.dismiss({});
  }

  getTeamPlayers(){
    // show loader
    this.loadingSpinner = true;
    // call an API localStorage.getItem('userId')
    this.leagueService.getAvailabilityStatus(this.schedule.fixtureId, this.schedule.clubId)
    .subscribe((value: any) => {
      // hide loader
      this.loadingSpinner = false;
      // check response
      if (value.responseState && value.data) {
        this.playerRadio = [];
        for(let i = 0; i < value.data.fixturePlayerStatus.length; i++){
          this.playerRadio[i] = value.data.fixturePlayerStatus[i].statusCode;
        }
        this.playersList = value.data;
      } else {
        this.ccUtil.fail_modal('Something went wrong, Please try later');
      }
    }, (error) => {
      this.loadingSpinner = false;
      console.log('Api error');
      if(error.name == 'HttpErrorResponse')
        this.ccUtil.fail_modal('Please check your Network Connection');
      else
        this.ccUtil.fail_modal(error.message);
    });
  }

  async openFinalizeTeamModal() {
    const availPlayers = this.playersList.fixturePlayerStatus.filter((o) => o.statusCode == 'A');
    /* open extras - NoBalls in modal to get data back to this page when modal closed */
    const modal = await this.modalController.create({
      component: FinalizeTeamComponent,
      cssClass: '',
      componentProps: {
        schedule: this.schedule,
        availablePlayers: availPlayers
      }
    });
    await modal.present();

    const resp: any = await modal.onDidDismiss();
    if (resp && resp.data) {
      
    }
  }

  updatePlayerAvailability(playerId, status){
    // show loader
    this.loadingSpinner = true;
    // call an API
    this.leagueService.updatePlayerAvailability(this.schedule.fixtureId, playerId, this.schedule.clubId, status)
    .subscribe((value: any) => {
      // hide loader
      this.loadingSpinner = false;
      // check response
      if (value.responseState && value.data) {
        // Refresh the List
        this.getTeamPlayers();
      } else {
        this.ccUtil.messageAlert('Status Update', 'Something went wrong, Please try later');
      }
    }, (error) => {
      this.loadingSpinner = false;
      console.log('Api error');
      if(error.name == 'HttpErrorResponse')
        this.ccUtil.fail_modal('Please check your Network Connection');
      else
        this.ccUtil.fail_modal(error.message);
    });
  }

}
