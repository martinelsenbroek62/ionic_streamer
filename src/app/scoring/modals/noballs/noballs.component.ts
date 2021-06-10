import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-noballs',
  templateUrl: './noballs.component.html',
  styleUrls: ['./noballs.component.scss'],
})
export class NoballsComponent implements OnInit {

  @Input() extrasAsGoodBall: any;
  extraBallType = 'runsOfBat';

  constructor(public modalController: ModalController) { }

  ngOnInit() {}

  getExtraBallType(type) {
    this.extraBallType = type;
  }

  dismissModal() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({});
  }

  addExtras(ballType, runs) {
    if (this.extraBallType == 'runsOfBat') {
      if (ballType == 'No Ball' && runs != 1) {
        ballType = 'No Ball of Bat';
      } else if (ballType == 'Good No Ball' && runs != 1) {
        ballType = 'Good No Ball of Bat';
      }
    } else if (this.extraBallType == 'bye') {
      ballType = ballType + ' Bye';
    } else if (this.extraBallType == 'legBye') {
      ballType = ballType + ' Leg Bye';
    }
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      ballType,
      runs
    });
  }

}
