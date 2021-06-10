import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ScoringService } from '../services/scoring.service';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { AlertController } from '@ionic/angular';
import { CcutilService } from 'src/app/services/ccutil.service';
import{ Storage }from '@ionic/storage';

@Component({
  selector: 'app-local-storage-details',
  templateUrl: './local-storage-details.page.html',
  styleUrls: ['./local-storage-details.page.scss'],
})
export class LocalStorageDetailsPage implements OnInit {
  public matchData: any = {};
  public ballsData: any = [];
  public matchExists: boolean;
  loadingSpinner: any;

  constructor(private router: Router, public socialSharing: SocialSharing, 
    private scoringService: ScoringService, private alertController: AlertController, 
    public ccUtil: CcutilService, private storage: Storage) { 
    
    if (this.router.getCurrentNavigation().extras.state) {
      this.matchData = this.router.getCurrentNavigation().extras.state.match;
      this.ballsData = JSON.stringify(this.matchData.balls);
      // get balls list
      this.getBallsData();
    }
  }

  ngOnInit() {
  }

  shareData() {
    let tempSubject = this.matchData.teamOneName+'-'+this.matchData.teamTwoName+'-'+this.matchData.matchDate;
    let tempMessage = tempSubject+JSON.stringify(this.matchData);
    this.socialSharing.share(tempMessage, tempSubject);
    
  }

  //To set the user token in matches table if the user logsin second time
  getBallsData(){
    this.scoringService.getBalls(this.matchData.clubId, this.matchData.matchId)
    .subscribe((value: any) => {
      if (value.responseState && value.data) { 
        this.matchExists = true;
      }else{
        
      }
    });
  }
  getUnsavedBalls(ballsData) {
    let unsavedBalls = [];
    // check if inning4Balls have any data
    if (ballsData.inning4Balls && ballsData.inning4Balls.length > 0) {
      // find objects of balls having isSaved equal to false
      const arr = ballsData.inning4Balls.filter((o) => o.isSaved == false);
      if (Array.isArray(arr)) {
        // merge two arrays
        unsavedBalls = [...unsavedBalls, ...arr];
      } else {
        // push an object to array
        unsavedBalls.push(arr);
      }
    }
    if (ballsData.inning3Balls && ballsData.inning3Balls.length > 0) {
      // find objects of balls having isSaved equal to false
      const arr = ballsData.inning3Balls.filter((o) => o.isSaved == false);
      if (Array.isArray(arr)) {
        // merge two arrays
        unsavedBalls = [...unsavedBalls, ...arr];
      } else {
        // push an object to array
        unsavedBalls.push(arr);
      }
    }
    if (ballsData.inning2Balls && ballsData.inning2Balls.length > 0) {
      // find objects of balls having isSaved equal to false
      const arr = ballsData.inning2Balls.filter((o) => o.isSaved == false);
      if (Array.isArray(arr)) {
        // merge two arrays
        unsavedBalls = [...unsavedBalls, ...arr];
      } else {
        // push an object to array
        unsavedBalls.push(arr);
      }
    }
    if (ballsData.inning1Balls && ballsData.inning1Balls.length > 0) {
      // find objects of balls having isSaved equal to false
      const arr = ballsData.inning1Balls.filter((o) => o.isSaved == false);
      if (Array.isArray(arr)) {
        // merge two arrays
        unsavedBalls = [...unsavedBalls, ...arr];
      } else {
        // push an object to array
        unsavedBalls.push(arr);
      }
    }
    return unsavedBalls;
  }

  saveBalls(callback?) {
    // store this ball-data in local storage too
    const storeBallsData = {
      clubId: this.matchData.clubId,
      matchId: this.matchData.matchId,
      matchDate: this.matchData.matchDate,
      teamOneId: this.matchData.teamOne,
      teamOneName: this.matchData.teamOneName,
      teamTwoId: this.matchData.teamTwo,
      teamTwoName: this.matchData.teamTwoName,
      balls: this.ballsData
    }
    let localStorageKey = 'match-' + this.matchData.clubId + '-' + this.matchData.matchId;

    this.storage.set(localStorageKey + 'save-balls', storeBallsData);
    // find unsaved balls and save it to server
    const unsavedBalls = this.getUnsavedBalls(this.ballsData);

    if(unsavedBalls && unsavedBalls.length){
      // call save ball API to save ball details
      this.scoringService.saveBallData(this.matchData.clubId, this.matchData.matchId, unsavedBalls)
      .subscribe((value: any) => {
        // hide loader
        this.loadingSpinner = false;
        // check response
        if (value.responseState && value.data) {
          console.log('value', value);
          const clientIds = Object.keys(value.data);
          // mark isSaved true for all saved balls
          // iterate all 4 inning balls to update isSaved:true
          for (const key in this.ballsData.inning1Balls) {
            if (this.ballsData.inning1Balls[key]) {
              const clientId = this.ballsData.inning1Balls[key].clientId;
              if (clientIds.includes(clientId.toString())) {
                // to update ball id
                this.ballsData.inning1Balls[key].ballId = value.data[clientId];
                this.ballsData.inning1Balls[key].isSaved = true;
              }
            }
          }
          for (const key in this.ballsData.inning2Balls) {
            if (this.ballsData.inning2Balls[key]) {
              const clientId = this.ballsData.inning2Balls[key].clientId;
              if (clientIds.includes(clientId.toString())) {
                // to update ball id
                this.ballsData.inning2Balls[key].ballId = value.data[clientId];
                this.ballsData.inning2Balls[key].isSaved = true;
              }
            }
          }
          for (const key in this.ballsData.inning3Balls) {
            if (this.ballsData.inning3Balls[key]) {
              const clientId = this.ballsData.inning3Balls[key].clientId;
              if (clientIds.includes(clientId.toString())) {
                // to update ball id
                this.ballsData.inning3Balls[key].ballId = value.data[clientId];
                this.ballsData.inning3Balls[key].isSaved = true;
              }
            }
          }
          for (const key in this.ballsData.inning4Balls) {
            if (this.ballsData.inning4Balls[key]) {
              const clientId = this.ballsData.inning4Balls[key].clientId;
              if (clientIds.includes(clientId.toString())) {
                // to update ball id
                this.ballsData.inning4Balls[key].ballId = value.data[clientId];
                this.ballsData.inning4Balls[key].isSaved = true;
              }
            }
          }
          // update this ball-data in local storage too
          const storeBallsData = {
            clubId: this.matchData.clubId,
            matchId: this.matchData.matchId,
            matchDate: this.matchData.matchDate,
            teamOneId: this.matchData.teamOne,
            teamOneName: this.matchData.teamOneName,
            teamTwoId: this.matchData.teamTwo,
            teamTwoName: this.matchData.teamTwoName,
            balls: this.ballsData
          }
          this.storage.set(localStorageKey + 'save-balls', storeBallsData);
          // call callback - balls are stored
          if (callback) { callback(true); };
        } else {
          console.log('Failed to call API');
          if(value.errorMessage){
            this.ccUtil.showError('Oops!!', value.errorMessage)
          }
          // call callback - balls are stored
          if (callback) { callback(false); };
        }
      }, (error) => {
        // hide loader
        this.loadingSpinner = false;
        console.log('Api error');
        // call callback - balls are stored
        if (callback) { callback(false); };
        // if(error.name == 'HttpErrorResponse')
          // this.ccUtil.fail_modal('Please check your Network Connection');
        // else
          // this.ccUtil.fail_modal(error.message);
      });
    } else {
      this.ccUtil.showError('Balls Uploaded', 'All the balls are already uploaded to server')
    }

    this.storage.get(localStorageKey + 'delete-balls').then(deletedBalls=>{
      if(deletedBalls && deletedBalls.length > 0){
        this.deleteBallsFromServer(deletedBalls);
      }
    });
  }

  deleteBallsFromServer(deletedBalls) {
    // call save ball API to save ball details
    this.scoringService.deleteBalls(this.matchData.clubId, deletedBalls)
    .subscribe((value: any) => {
      // check response
      if (value.responseState && value.data) {
        console.log('value', value);
        // value.data will be an object having keys of clientId deleted at server
        // for (const id in value.data) {
        //   if (value.data[id]) {
        //     const msg = value.data[id];
        //     if (msg == '1 Ball Deleted') {
        //       // remove object from array match by clientId
        //       const index = this.currentInningBalls.findIndex((o) => o.clientId == id);
        //       if (index > -1) this.currentInningBalls.splice(index, 1);
        //       // remove from local array and update local storage
        //       const clientIdLocalIndex = this.ballToDeleteClientIdArr.indexOf(Number(id));
        //       if (clientIdLocalIndex > -1) {
        //         this.ballToDeleteClientIdArr.splice(clientIdLocalIndex, 1);
        //       }
        //     }
        //   }
        // }
        // update deleted balls to local storage
        // this.storage.set(this.localStorageKey + 'delete-balls', this.ballToDeleteClientIdArr);
        // // store this ball-data in local storage too
        // const storeBallsData = {
        //   clubId: this.matchData.clubId,
        //   matchId: this.matchData.matchId,
        //   matchDate: this.matchData.matchDate,
        //   teamOneId: this.matchData.teamOne,
        //   teamOneName: this.matchData.teamOneName,
        //   teamTwoId: this.matchData.teamTwo,
        //   teamTwoName: this.matchData.teamTwoName,
        //   balls: this.ballsData
        // }
        // this.storage.set(this.localStorageKey + 'save-balls', storeBallsData);
      } else {
        console.log('Failed to call API');
        if(value.errorMessage){
          this.ccUtil.showError('Oops!!', value.errorMessage);
        }
      }
    }, (error) => {
      console.log('Api error');
      if(error.name == 'HttpErrorResponse')
        this.ccUtil.fail_modal('Please check your Network Connection');
      else
        this.ccUtil.fail_modal(error.message);
    });
  }

  uploadData() {
    if(this.matchExists){
      if(localStorage.getItem('X-Auth-Token')){
        this.saveBalls();
      } else{
        this.showLoginAlert();
      }
    } else {
      this.ccUtil.showError('Oops','No Fixture available with this ID, Fixture might be deleted or re-created with different ID!');
    }
  }

  async showLoginAlert() {
    const loginAlert = await this.alertController.create({
      header: 'Oops!',
      subHeader: 'Your Session expired! Please Login to continue...',
      backdropDismiss: false,
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            //console.log('Login Cancelled');
          }
        },
        {
          text: 'Login',
          handler: () => {
            this.router.navigate(['/']);
          }
        }
      ]
    });
    await loginAlert.present();
  }

}
