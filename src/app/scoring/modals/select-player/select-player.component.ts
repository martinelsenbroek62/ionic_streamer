import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CcutilService } from 'src/app/services/ccutil.service';

@Component({
  selector: 'app-select-player',
  templateUrl: './select-player.component.html',
  styleUrls: ['./select-player.component.scss'],
})
export class SelectPlayerComponent implements OnInit {

  // Data passed in by componentProps
  // get value of match details passed from live-scoring-list page
  @Input() playerList: any;
  @Input() playerRole: any;
  @Input() prevBowler: any;
  @Input() isEdit: any;

  selectedPlayer: any;
  selectedOvers: any = 'currentOver';

  constructor(public modalController: ModalController, public ccUtil: CcutilService) {
  }

  ngOnInit() {
    console.log('playerList', this.playerList);
    if (this.prevBowler && this.playerList[this.prevBowler]) {
      this.selectedPlayer = String(this.prevBowler);
    }
    else if (this.playerList) {
      this.selectedPlayer = Object.keys(this.playerList)[0];
    }
  }

  dismissModal() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({});
  }

  saveAndDismissModal() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      selectedPlayer: this.selectedPlayer,
      selectedOvers: this.selectedOvers
    });
  }

  addPlayer(){
    this.modalController.dismiss({
      addPlayer: true
    });
  }

}
