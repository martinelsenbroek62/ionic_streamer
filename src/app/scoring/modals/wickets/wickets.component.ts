import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ExtrasComponent } from '../extras/extras.component';

@Component({
  selector: 'app-wickets',
  templateUrl: './wickets.component.html',
  styleUrls: ['./wickets.component.scss'],
})
export class WicketsComponent implements OnInit {
  @Input() wicketData: any;
  @Input() extrasAsGoodBall: any;

  public wicketType:any = '';
  public runs:any;
  public bowlingTeam: any[] = [];
  public bowlingTeamWithoutBowler: any[] = [];
  public fielder1: any;
  public fielder2: any;
  public wicketRunsData = {
    runs: 0,
    isSix: false,
    isFour: false,
    ballType: ''
  };
  public outBatsman: any;
  public wideBall = false;
  public substituteName: any;
  public showSubstitute = false;

  constructor(public modalController: ModalController) {
  }

  ngOnInit() {
    this.outBatsman = this.wicketData.batsmanId;
    this.fielder1 = this.wicketData.bowlerId;
    this.getBowlingTeams();
  }

  dismissModal() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss();
  }

  getBowlingTeams() {
    const arr = this.sortIt(this.wicketData.bowlingTeam);

    this.bowlingTeam.push({id: -1, name: 'Substitute'});
    this.bowlingTeamWithoutBowler.push({id: -1, name: 'Substitute'});

    arr.forEach(player => {
      this.bowlingTeam.push({id: Number(player), name:this.wicketData.bowlingTeam[player]});
    });
    arr.forEach(player => {
      if(player != this.wicketData.bowlerId)
        this.bowlingTeamWithoutBowler.push({id: Number(player), name:this.wicketData.bowlingTeam[player]});
    });
  }

  checkPlayer() {
    if (this.fielder1 == '-1' || this.fielder2 == '-1') {
      this.showSubstitute = true;
    } else {
      this.showSubstitute = false;
    }
  }

  sortIt(obj) {
    const _obj = obj;
    let arr = Object.keys(obj);
    arr.sort(function(a,b) {
      if(_obj[a].toUpperCase() > _obj[b].toUpperCase())
      return 1;
      else if(_obj[a].toUpperCase() < _obj[b].toUpperCase())
      return -1;
      else
      return 0;
    })
    return arr;
  }

  saveWicket() {
    // Set the default wicket keeper
    if (this.fielder1 == undefined) {
      if (this.wicketType == 'st' || this.wicketType == 'ctw') {
        this.fielder1 = this.bowlingTeamWithoutBowler[1].id;
      } else {
        this.fielder1 = this.wicketData.bowlerId;
      }
    }
    this.modalController.dismiss({
      wicketType: this.wicketType,
      wicketTaker1: this.fielder1,
      wicketTaker2: this.fielder2,
      runs: this.wicketRunsData.runs,
      ballType: this.wicketRunsData.ballType,
      outPerson: this.outBatsman,
      wide: this.wideBall,
      isFour: this.wicketRunsData.isFour,
      isSix: this.wicketRunsData.isSix,
      substituteName: this.substituteName
    });
  }

  async selectWicketRuns() {
    const modal = await this.modalController.create({
      component: ExtrasComponent,
      cssClass: '',
      componentProps: {
        extrasAsGoodBall: this.extrasAsGoodBall
      }
    });
    await modal.present();

    const resp: any = await modal.onDidDismiss();
    if (resp && resp.data && resp.data.ballType) {
      this.wicketRunsData.runs = resp.data.runs;
      this.wicketRunsData.ballType = resp.data.ballType;
      this.wicketRunsData.isFour = resp.data.isFour;
      this.wicketRunsData.isSix = resp.data.isSix;
    }
  }

}
