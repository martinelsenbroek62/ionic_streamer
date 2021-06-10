import { Component, HostListener, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CcutilService } from 'src/app/services/ccutil.service';

@Component({
  selector: 'app-toss',
  templateUrl: './toss.component.html',
  styleUrls: ['./toss.component.scss'],
})
export class TossComponent implements OnInit {

  // Data passed in by componentProps
  // get value of match details passed from live-scoring-list page
  @Input() matchData: any;
  @Input() liveScoringTeamsData: any;

  public tossWonTeam: any;
  public tossSelected: any;
  public teams = [{id:'', name:''}, {id:'', name:''}];
  public coinClass: string;

  constructor(public modalController: ModalController, public ccUtil: CcutilService) {
  }

  ngOnInit() {
    // set battingFirst - if previously selected
    if (this.liveScoringTeamsData.tossWon != 0) {
      this.tossWonTeam = this.liveScoringTeamsData.battingFirst;
      if (this.liveScoringTeamsData.battingFirst) {
        this.tossSelected = 'batting';
      }
    }
    // set team id
    this.teams[0].id = this.matchData.teamOne;
    this.teams[1].id = this.matchData.teamTwo;
    // set team name
    this.teams[0].name = this.matchData.teamOneName
    this.teams[1].name = this.matchData.teamTwoName
  }

  dismissModal(data: any) {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss(data);
  }

  tossCoin() {
    this.coinClass = '';
    setTimeout(() => {
      const flipResult = Math.random();
      if (flipResult <= 0.5) {
        this.coinClass = 'heads';
        setTimeout(() => {
          this.tossWonTeam = this.teams[0].id;
          this.tossSelected = 'batting';
        }, 3050);
      } else {
        this.coinClass = 'tails';
        setTimeout(() => {
          this.tossWonTeam = this.teams[1].id;
          this.tossSelected = 'batting';
        }, 3050);
      }
    }, 10);
    // console.log('Toss Result :', this.coinClass);
  }

  setToss() {
    let battingTeam;
    if (this.teams[0].id == this.tossWonTeam)
      if (this.tossSelected == 'batting')
        battingTeam = this.teams[0].id;
      else
        battingTeam = this.teams[1].id;
    else if (this.tossSelected == 'batting')
      battingTeam = this.teams[1].id;
    else
      battingTeam = this.teams[0].id;

    // this.viewCtrl.dismiss({
    //   tossWon: this.tossWonTeam,
    //   battingFirst: battingTeam
    // });
    this.dismissModal({
      tossWon: this.tossWonTeam,
      battingFirst: battingTeam
    });
  }

}
