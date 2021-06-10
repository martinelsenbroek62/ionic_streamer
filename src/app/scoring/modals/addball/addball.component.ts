import { Component, HostListener, Input, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { CcutilService } from 'src/app/services/ccutil.service';
import { ExtrasComponent } from '../extras/extras.component';

@Component({
  selector: 'app-addball',
  templateUrl: './addball.component.html',
  styleUrls: ['./addball.component.scss'],
})
export class AddballComponent implements OnInit {

  @Input() over: any;
  @Input() bowlingPlayers: any;
  @Input() battingPlayers: any;
  @Input() actionsData: any;
  @Input() lastBallData: any;

  public newBall : any = {};

  constructor(public modalController: ModalController, private alertController: AlertController, public ccUtil: CcutilService) { }

  ngOnInit() {
    this.newBall.ball = 1;
    this.newBall.ballType = 'Good Ball';
    this.newBall.runs = 0;
    this.newBall.batsman = this.lastBallData.batsman;
    this.newBall.runner = this.lastBallData.runner;
    this.newBall.bowler = this.lastBallData.bowler;
  }

  dismissModal() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss();
  }

  dismissModalOnSave() {
    this.modalController.dismiss({
      newBallObj: this.newBall
    });
  }

  async editBall() {
    /* open All Extras in modal to get data back to this page when modal closed */
    const modal = await this.modalController.create({
      component: ExtrasComponent,
      cssClass: '',
      componentProps: {
        extrasAsGoodBall: this.actionsData.extrasAsGoodBall
      }
    });
    await modal.present();

    const resp: any = await modal.onDidDismiss();
    if (resp && resp.data && resp.data.ballType) {
      let runs = resp.data.runs;
      if (resp.data.ballType == 'Wide' || resp.data.ballType == 'Good Wide') {
        runs = resp.data.runs + (Number(this.actionsData.runsForWide) - 1);
      } else if (['No Ball', 'No Ball of Bat', 'Good No Ball', 'No Ball Bye', 'Good No Ball Bye', 'No Ball Leg Bye', 'Good No Ball Leg Bye', 'Good No Ball of Bat'].includes(resp.data.ballType)) {
        runs = resp.data.runs + (Number(this.actionsData.runsForNoBall) - 1);
      }

      // update properties in ball index andter edit ball response
      this.newBall.ballType = resp.data.ballType;
      this.newBall.isFour = resp.data.isFour;
      this.newBall.isSix = resp.data.isSix;
      this.newBall.runs = runs;
      this.newBall.ballRequestFrom = 'AddNewBallFromEdit';
    }
  }
}
