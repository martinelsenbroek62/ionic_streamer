import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CcutilService } from 'src/app/services/ccutil.service';
import { LeagueService } from '../../services/league.service';

@Component({
  selector: 'app-finalize-team',
  templateUrl: './finalize-team.component.html',
  styleUrls: ['./finalize-team.component.scss'],
})
export class FinalizeTeamComponent implements OnInit {
  @Input() schedule: any;
  @Input() availablePlayers: any;
  
  loadingSpinner: any;
  finalPlayersList: any = [];

  constructor(private modalController: ModalController, private leagueService: LeagueService, 
    public ccUtil: CcutilService) { }

  ngOnInit() {
    console.log(this.availablePlayers);
    this.availablePlayers.forEach(player => {
      this.finalPlayersList.push(player.playerId);
    });
  }

  dismissModal() {
    // using the injected ModalController this page
    // can 'dismiss' itself and optionally pass back data
    this.modalController.dismiss({});
  }

  addRemovePlayers(playerId){
    if (this.finalPlayersList.indexOf(playerId) < 0) {
      // add player if not found in selected array
      this.finalPlayersList.push(playerId);
    } else {
      // remove player if found in selected array
      this.finalPlayersList.splice(this.finalPlayersList.indexOf(playerId), 1);
    }
  }

  finalizePlayingXI(){
    // show loader
    this.loadingSpinner = true;
    // call an API localStorage.getItem('userId')
    this.leagueService.finalizePlayingXI(this.schedule.clubId, this.schedule.fixtureId, this.finalPlayersList)
    .subscribe((value: any) => {
      // hide loader
      this.loadingSpinner = false;
      // check response
      if (value.responseState && value.data) {
        // show success message redirect to mySchedule page
        this.ccUtil.presentToast('Finalized Players Successfully!!');
        this.modalController.dismiss({});
      } else if(value.errorMessage){
          this.ccUtil.messageAlert('Oops !!!', value.errorMessage);
      } else{
        this.ccUtil.messageAlert('Oops !!!', 'Something went wrong, please try again');
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
