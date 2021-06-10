import { Component, Input, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-extras',
  templateUrl: './extras.component.html',
  styleUrls: ['./extras.component.scss'],
})
export class ExtrasComponent implements OnInit {
  @Input() extrasAsGoodBall: any;
  public extraGoodBallType = 'goodRunsOfBat';
  public extraBallType = 'runsOfBat';
  public isFour = false;
  public isSix = false;

  constructor(public modalController: ModalController, private alertController: AlertController) {
  }

  ngOnInit() {}

  dismissModal() {
    // using the injected ModalController this page
    // can 'dismiss' itself and optionally pass back data
    this.modalController.dismiss({});
  }

  getExtraBallType(type, section) {
    if (section == 'goodBall') {
      this.extraGoodBallType = type;
    } else {
      this.extraBallType = type;
    }
  }

  getBallType(ballType, runs): string {
    if (ballType == 'Good No Ball') {
      if (this.extraGoodBallType == 'goodRunsOfBat') {
        if (runs == 1)
          ballType = 'Good No Ball';
        else
          ballType = 'Good No Ball of Bat';
      } else if (this.extraGoodBallType == 'goodBye') {
        ballType = 'Good No Ball Bye';
      } else if (this.extraGoodBallType == 'goodLegBye') {
        ballType = 'Good No Ball Leg Bye';
      }
    } else if (ballType == 'No Ball') {
      if (this.extraBallType == 'runsOfBat') {
        if (runs == 1)
          ballType = 'No Ball';
        else
          ballType = 'No Ball of Bat';
      } else if (this.extraBallType == 'bye') {
        ballType = 'No Ball Bye';
      } else if (this.extraBallType == 'legBye') {
        ballType = 'No Ball Leg Bye';
      }
    }

    return ballType;
  }

  addExtras(ballType, runs) {
    ballType = this.getBallType(ballType, runs);
    // using the injected ModalController this page
    // can 'dismiss' itself and optionally pass back data
    this.modalController.dismiss({
      ballType,
      runs,
      isFour: this.isFour,
      isSix: this.isSix
    });
  }

  async isBoundary(ballType, runs) {
    const isBoundaryAlert = await this.alertController.create({
      header: 'Boundary',
      subHeader: 'Is this Boundary?',
      backdropDismiss: false,
      buttons: [
        {
          text: 'No',
          handler: () => {
            ballType = this.getBallType(ballType, runs);
            this.modalController.dismiss({
              ballType,
              runs,
              isFour: this.isFour,
              isSix: this.isSix
            });
          }
        },
        {
          text: 'Yes',
          handler: () => {
            if(runs == 4){
              this.isFour = true;
            } else if(runs == 6){
              this.isSix = true;
            }
            ballType = this.getBallType(ballType, runs);
            this.modalController.dismiss({
              ballType,
              runs,
              isFour: this.isFour,
              isSix: this.isSix
            });
          }
        }
      ]
    });
    await isBoundaryAlert.present();
  }

}
