import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CcutilService } from 'src/app/services/ccutil.service';

@Component({
  selector: 'app-wides',
  templateUrl: './wides.component.html',
  styleUrls: ['./wides.component.scss'],
})
export class WidesComponent implements OnInit {
  // Data passed in by componentProps
  // get value of match details passed from live-scoring-list page
  @Input() extrasAsGoodBall: any;

  constructor(public modalController: ModalController, public ccUtil: CcutilService) {
  }

  ngOnInit() {}

  dismissModal() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({});
  }

  addExtras(ballType, runs) {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      ballType,
      runs
    });
  }

}
