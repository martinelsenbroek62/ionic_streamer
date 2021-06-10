import { Component, HostListener, Input, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { CcutilService } from 'src/app/services/ccutil.service';
import { AddballComponent } from '../addball/addball.component';
import { ExtrasComponent } from '../extras/extras.component';

@Component({
  selector: 'app-edit-balls',
  templateUrl: './edit-balls.component.html',
  styleUrls: ['./edit-balls.component.scss'],
})
export class EditBallsComponent implements OnInit {
  @Input() ballsDataObj: any = {};
  @Input() bowlingPlayers: any;
  @Input() battingPlayers: any;
  @Input() currentBallObj: any;
  @Input() nonDisplayBallsArr: any;
  @Input() actionsData: any;

  inningsNumber: any;
  currentOverNumber: any;
  currentBallNumber: any;
  currentInningBalls: any = [];
  selectedOverBallsList: any = [];
  selectedBowlerBall: any = [];
  showCard: any = {0: true};
  selectedBowlerOver: any;
  editedBallsCount = {};
  deleteBallsFromEdit = [];
  changeOverFlag = false;

  Arr = Array; // Array type captured in a variable

  constructor(public modalController: ModalController, private alertController: AlertController, public ccUtil: CcutilService) {
  }

  ngOnInit() {
    this.inningsNumber = this.currentBallObj.inningsNumber;
    this.currentOverNumber = this.currentBallObj.over;
    this.currentBallNumber = this.currentBallObj.ball;
    this.currentInningBalls = this.ballsDataObj['inning' + this.inningsNumber + 'Balls'];
    this.selectedOverBallsList = this.currentInningBalls.filter((o) => (o.over == this.currentOverNumber));

    this.selectedBowlerOver = Number(this.selectedOverBallsList[0].bowler);
  }

  dismissModal() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss();
  }

  dismissModalOnSave() {
    this.modalController.dismiss({
      ballsDataObj: this.ballsDataObj,
      deleteBallsFromEdit: this.deleteBallsFromEdit
    });
  }

  showHideCard(index) {
    const toggleValue = !this.showCard[index];
    // re initialize to hide all other cards
    this.showCard = {};
    // show only clicked card
    this.showCard[index] = toggleValue;
  }

  changeInning() {
    this.changeOverFlag = true;
    this.currentInningBalls = this.ballsDataObj['inning' + this.inningsNumber + 'Balls'];
    this.selectedOverBallsList = this.currentInningBalls.filter((o) => o.over == this.currentOverNumber);
    // change bowler
    this.selectedBowlerOver = this.selectedOverBallsList[0].bowler;
  }

  changeOver() {
    this.changeOverFlag = true;
    this.selectedOverBallsList = this.currentInningBalls.filter((o) => o.over == this.currentOverNumber);
    // change bowler
    this.selectedBowlerOver = this.selectedOverBallsList[0].bowler;
  }

  changeBowlerBall(index) {
    // replace each bowler id
    const oldBowler = this.selectedOverBallsList[index].bowler;
    if (this.selectedOverBallsList[index].wicketTaker1 == oldBowler) {
      // also change wicketTaker1 bowler
      this.selectedOverBallsList[index].wicketTaker1 = this.selectedBowlerBall[index];
    }
    if (this.selectedOverBallsList[index].wicketTaker2 == oldBowler) {
      // also change wicketTaker1 bowler
      this.selectedOverBallsList[index].wicketTaker2 = this.selectedBowlerBall[index];
    }
    // set other params when bowler changed
    this.selectedOverBallsList[index].bowler = this.selectedBowlerBall[index];
    this.selectedOverBallsList[index].isSaved = false;
    this.selectedOverBallsList[index].ballRequestFrom = 'ChangeBowlerApp';
    // to show the count how many balls are edited
    this.editedBallsCount[this.selectedOverBallsList[index].ballId] = true;
  }

  changeBowlerOver() {
    if (!this.changeOverFlag) {
      for (const index in this.selectedOverBallsList) {
        if (this.selectedOverBallsList[index]) {
          // change bowler
          // replace each bowler id
          const oldBowler = this.selectedOverBallsList[index].bowler;
          if (this.selectedOverBallsList[index].wicketTaker1 == oldBowler) {
            // also change wicketTaker1 bowler
            this.selectedOverBallsList[index].wicketTaker1 = this.selectedBowlerOver;
          }
          if (this.selectedOverBallsList[index].wicketTaker2 == oldBowler) {
            // also change wicketTaker1 bowler
            this.selectedOverBallsList[index].wicketTaker2 = this.selectedBowlerOver;
          }
          // set other params when bowler changed
          this.selectedOverBallsList[index].bowler = this.selectedBowlerOver;
          this.selectedOverBallsList[index].isSaved = false;
          this.selectedOverBallsList[index].ballRequestFrom = 'ChangeBowlerApp';
          if (!this.nonDisplayBallsArr.includes(this.selectedOverBallsList[index].ballType)) {
            // to show the count how many balls are edited
            this.editedBallsCount[this.selectedOverBallsList[index].ballId] = true;
          }
        }
      }
    }
    this.changeOverFlag = false;
  }

  async deleteBalls(index){
    const deleteBallAlert = await this.alertController.create({
      header: 'Delay Match',
      subHeader: 'Are you sure you want to delete the Ball?',
      backdropDismiss: false,
      buttons: [
       {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Yes',
          handler: () => {
            const ballToDelete = this.selectedOverBallsList[index];
            // add ball object to delete in deleteArr
            this.deleteBallsFromEdit.push(ballToDelete.clientId);
            // remove deleted ball from current arrys
            this.selectedOverBallsList.splice(index, 1);
          }
        }
      ]
    });
    await deleteBallAlert.present();
  }

  swapPlayers(index) {
    const tempBatsman = this.selectedOverBallsList[index].batsman;
    this.selectedOverBallsList[index].batsman = this.selectedOverBallsList[index].runner;
    this.selectedOverBallsList[index].runner = tempBatsman;
    this.selectedOverBallsList[index].isSaved = false;
    this.selectedOverBallsList[index].ballRequestFrom = 'SwapPlayersApp';
    // to show the count how many balls are edited
    this.editedBallsCount[this.selectedOverBallsList[index].ballId] = true;
  }

  async editBall(index) {
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
      this.selectedOverBallsList[index].ballType = resp.data.ballType;
      // if(this.selectedOverBallsList[index].runs == 4 && data.runs != 4)
      this.selectedOverBallsList[index].isFour = resp.data.isFour;
      // if(this.selectedOverBallsList[index].runs == 6 && data.runs != 6)
      this.selectedOverBallsList[index].isSix = resp.data.isSix;
      this.selectedOverBallsList[index].runs = runs;
      this.selectedOverBallsList[index].isSaved = false;
      this.selectedOverBallsList[index].ballRequestFrom = 'EditBallApp';

      // to show the count how many balls are edited
      this.editedBallsCount[this.selectedOverBallsList[index].ballId] = true;
    }
  }

  async addNewBallModal() {
    const lastBallData = this.currentInningBalls[this.currentInningBalls.length - 1];
    /* open edit-balls in modal to get data back to this page when modal closed */
    const modal = await this.modalController.create({
      component: AddballComponent,
      cssClass: '',
      componentProps: {
        over: this.currentOverNumber,
        bowlingPlayers: this.bowlingPlayers,
        battingPlayers: this.battingPlayers,
        actionsData: this.actionsData,
        lastBallData
      }
    });
    await modal.present();

    const resp: any = await modal.onDidDismiss();
    if (resp && resp.data && resp.data.newBallObj) {
      const data = resp.data.newBallObj;
      const d = new Date();
      const ball = {
        ballId: 0,
        inningsNumber: this.inningsNumber,
        over: this.currentOverNumber,
        ball: data.ball,
        runs: data.runs,
        ballType: data.ballType,
        batsman: data.batsman,
        runner: data.runner,
        bowler: data.bowler,
        comment: '',
        direction: 'undefined;undefined;undefined',
        isFour: false,
        isSix: false,
        isSaved: false,
        clientId: d.valueOf(),
        ballRequestFrom: 'AddBallFromEdit',
        seriesType: lastBallData.seriesType
      }

      const ballIndex = this.currentInningBalls.findIndex((o) => (o.over == data.over && o.ball == data.ball));
      if (ballIndex > 0) {
        this.currentInningBalls.splice(ballIndex, 0, ball);
      } else {
        this.currentInningBalls.push(ball);
      }

      this.selectedOverBallsList.push(ball);
      this.selectedBowlerOver = ball.bowler;
      this.ccUtil.presentToast('New Ball Added');
    }
  }

}
