import { Component, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { AlertController, ModalController, NavController } from '@ionic/angular';
import { ScoringService } from '../services/scoring.service';
import { CcutilService } from 'src/app/services/ccutil.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AddCommentComponent } from '../modals/add-comment/add-comment.component';
import { TossComponent } from '../modals/toss/toss.component';
import { EditBallsComponent } from '../modals/edit-balls/edit-balls.component';
import { ActionsComponent } from '../modals/actions/actions.component';
import{ Storage }from '@ionic/storage';
import { SelectPlayerComponent } from '../modals/select-player/select-player.component';
import { WidesComponent } from '../modals/wides/wides.component';
import { NoballsComponent } from '../modals/noballs/noballs.component';
import { WicketsComponent } from '../modals/wickets/wickets.component';
import { ExtrasComponent } from '../modals/extras/extras.component';
import { PitchmapDirectionsComponent } from '../modals/pitchmap-directions/pitchmap-directions.component';
import { AddPlayersComponent } from '../modals/add-players/add-players.component';
import { RemovePlayersComponent } from '../modals/remove-players/remove-players.component';
import { DlsChartPageComponent } from '../modals/dls-chart-page/dls-chart-page.component';
import { ManOfTheMatchComponent } from '../modals/man-of-the-match/man-of-the-match.component';
import { AddPlayersClubComponent } from '../modals/add-players-club/add-players-club.component';

@Component({
  selector: 'app-scoring',
  templateUrl: './scoring.page.html',
  styleUrls: ['./scoring.page.scss'],
})
export class ScoringPage implements OnInit, OnDestroy {

  goodBallsArr = ['Good Ball', 'Good Wide', 'Bye', 'Leg Bye', 'Good No Ball Bye', 'Good No Ball Leg Bye', 'Good No Ball', 'Good No Ball of Bat', 'Bowler Count Ball'];

  goodBallsBatsmanArr = ['Good Ball', 'No Ball', 'No Ball of Bat', 'Bye', 'Leg Bye', 'Good No Ball of Bat' ,'No Ball Leg Bye', 'Good No Ball Leg Bye', 'No Ball Bye', 'Good No Ball Bye'];

  goodBallsBowlerArr = ['Good Ball', 'Good Wide', 'Bye', 'Leg Bye', 'Good No Ball', 'Good No Ball of Bat', 'Good No Ball Bye', 'Good No Ball Leg Bye', 'Bowler Count Ball'];

  goodBallsBowlerRunsArr = ['Good Ball', 'Good Wide', 'No Ball of Bat', 'No Ball', 'Wide', 'Good No Ball', 'Good No Ball of Bat', 'Good No Ball Leg Bye', 'Good No Ball Bye'];

  goodBallsBowlerMaidensArr = ['Good Ball', 'Wide', 'No Ball Leg Bye',  'Good No Ball Leg Bye', 'No Ball Bye', 'Good No Ball Bye', 'No Ball of Bat', 'Good No Ball of Bat'];

  extraBallsArr = [];
  nonDisplayBallsArr = ['No Count Ball', 'Auto Comment Ball'];

  matchData: any;
  ballsData: any;
  errorMessage = '';
  loadingSpinner = false;
  deletingBallInProgress = false;
  plusOneBall = false;
  isRetireBowler = false;

  modalSelectPlayerComponent = false;

  public liveScoringTeamsData: any = {};
  public setupLiveScoringTeams = {};
  public innings:any;
  public teams:any;
  public currentOver = [];
  public currentBall = {};
  public disableScoreKeypad = true;
  currentInningBalls: any;
  currentBallObj: any;
  localStorageKey: any;
  ballToDeleteClientIdArr = [];

  public ballConfig: any = {
    inningsNumber:1, over:0, ballNum:1, batsman:0, runner:0, bowler:0, outPerson:0, wicketTaker1:0, wicketTaker2:0,
    outMethod:''
  };

  actionsData: any = {
    disableDirections: false,
    disablePitchMap: false,
    extrasAsGoodBall: false,
    ballsLength: 0,
    inningsNumber: 1,
    canAddPlayers: false,
    seriesType: '',
    disableOnStrikePopup: false,
    continueInning: false,
    runsForWide: 1,
    runsForNoBall: 1
  }

  public currentStats:any;
  public matchKey: string;
  public outPlayers = {};
  public nonPlayingTeam1 = [];
  public nonPlayingTeam2 = [];
  public deletedBalls = [];
  public twoXInnings: boolean;
  public testMatch: boolean;
  public followOnMatch = 0;
  public isPracticeMatch: boolean;
  public liveScoringPracticeTeamsData: any;
  public nonPlayingPlayersPractice: any;
  public DLTargetData = {};
  public showParScoreButton = true;
  public userPreferences: any = {};
  public showEndMatch = true;
  public nonBattingTeam:any[];
  public nonBowlingTeam:any[];
  public nonBattingTeamIds:any[];
  public nonBowlingTeamIds:any[];
  public loader: any;

  constructor(public modalController: ModalController, private scoringService: ScoringService, 
    public ccUtil: CcutilService, private route: ActivatedRoute, private router: Router, 
    private storage: Storage, private alertController: AlertController, private navCtrl: NavController) {
    // initialize currentStats params
    this.currentStats = this.getInitialCurrentStatsObj();
    // show loading spinner
    this.loadingSpinner = true;
    this.route.queryParams.subscribe(params => {
      // get value from navigation extras
      if (this.router.getCurrentNavigation().extras.state) {
        // hide loading spinner
        this.loadingSpinner = false;
        // get value of match details passed from live-scoring-list page
        this.matchData = this.router.getCurrentNavigation().extras.state.match;

        this.localStorageKey = 'match-' + this.matchData.clubId + '-' + this.matchData.matchId;

        // get live match information to be used in scoring
        if (!this.matchData) {
          // this.navCtrl.setRoot('LiveScoringPage');
        } else {
          // get live scoring details
          this.getLiveScoringTeamsData(this.matchData);

          this.teams = {1:{players:{}},2:{players:{}}};
          this.innings = {1:[],2:[],3:[],4:[]};

          if(this.matchData.seriesType == 'Test') {
            this.testMatch = true;
          } else {
            this.testMatch = false;
          }
          if(this.matchData.seriesType == '2X') {
            this.twoXInnings = true;
          } else {
            this.twoXInnings = false;
          }
          if(this.matchData.seriesType == '100b') {
            this.ccUtil.ballsPerOver = 5;
          }else{
            this.ccUtil.ballsPerOver = 6;
          }
        }
        this.getUserPreferencesFromLocal();
      }
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    if (this.scoringService.endScorerSessionSubscriber) {
      // do unsubscribe on destroy if soring ends not called
      this.scoringService.endScorerSessionSubscriber.unsubscribe();
    }
  }

  getInitialCurrentStatsObj(currentStats = {}) {
    // merge two objects, in second we initialize params to default
    // also currentStats default value is {}
    return {...currentStats, ...{
      actionType: 'inningRunning',
      batsman: 0,
      runner: 0,
      bowler: 0,
      prevBowler: 0,
      batsmanName: '',
      runnerName: '',
      bowlerName: '',
      prevBowlerName: '',
      batsmanObj : {runs:0, balls:0, fours:0, sixes:0, sr:'0.00'},
      runnerObj: {runs:0, balls:0, fours:0, sixes:0, sr:'0.00'},
      bowlerObj: {balls:0, overs:0, maidens:0, runs:0, wickets:0, econ:'0.00'},
      prevBowlerObj: {balls:0, overs:0, maidens:0, runs:0, wickets:0, econ:'0.00'},
      currentOverTotalRuns: 0,
      showSelectBowler: false,
      parScore: 0
    }};
  }

  getLiveScoringTeamsData(matchData) {
    // this.liveScoringTeams = [];
    this.errorMessage = '';
    // show loader
    this.loadingSpinner = true;
    // call an API
    this.scoringService.getLiveMatchInfo(matchData.clubId, matchData.matchId)
    .subscribe((value: any) => {
      // hide loader
      this.loadingSpinner = false;
      // check response
      if (value.responseState && value.data) {
        console.log('value', value);
        // get match details
        this.liveScoringTeamsData = value.data;
        // set battingPlayers and bowlingPlayers
        // if battingFirst team id is equal to teamOne than battingPlayers will be of team one players
        if (this.liveScoringTeamsData.battingFirst == this.liveScoringTeamsData.teamOne) {
          // teamOnePlayers is batting first players
          this.liveScoringTeamsData.battingPlayers = this.liveScoringTeamsData.players1;
          this.liveScoringTeamsData.bowlingPlayers = this.liveScoringTeamsData.players2;
          this.liveScoringTeamsData.battingTeamName = this.liveScoringTeamsData.teamOneName;
          this.liveScoringTeamsData.bowlingTeamName = this.liveScoringTeamsData.teamTwoName;
        } else {
          this.liveScoringTeamsData.battingPlayers = this.liveScoringTeamsData.players2;
          this.liveScoringTeamsData.bowlingPlayers = this.liveScoringTeamsData.players1;
          this.liveScoringTeamsData.battingTeamName = this.liveScoringTeamsData.teamTwoName;
          this.liveScoringTeamsData.bowlingTeamName = this.liveScoringTeamsData.teamOneName;
        }
        // get balls info details
        this.getBalls(this.matchData);

        this.followOnMatch = this.liveScoringTeamsData.isFollowon;
        // this.global.isDLsMatch = this.liveScoringTeamsData.isDls;
        // this.DLTargetData.t2Target = this.liveScoringTeamsData.t2Target;
        // this.DLTargetData.t2RevisedOvers = this.liveScoringTeamsData.t2RevisedOvers;
        // this.getBallsData(this.matchData.matchID);
        // this.mapTeams();
        // this.setToss('');

        // check if tossWon already not set
        if(!this.liveScoringTeamsData.tossWon) {
          this.setTossModal();
        }
      } else {
        console.log('Failed to call API');
        if(value.errorMessage){
          this.errorMessage = value.errorMessage;
        }
      }
    }, (error) => {
      // hide loader
      this.loadingSpinner = false;
      console.log('Api error');
      if(error.name == 'HttpErrorResponse')
        this.ccUtil.fail_modal('Please check your Network Connection');
      else
        this.ccUtil.fail_modal(error.message);
    });
  }

  setTeams(inningNum) {
    // set battingPlayers and bowlingPlayers
    if (inningNum == 2) {
      // swap batting/bowling team
      const tempBattingPlayers = this.liveScoringTeamsData.battingPlayers;
      const tempName = this.liveScoringTeamsData.battingTeamName;

      this.liveScoringTeamsData.battingPlayers = this.liveScoringTeamsData.bowlingPlayers;
      this.liveScoringTeamsData.battingTeamName = this.liveScoringTeamsData.bowlingTeamName;

      this.liveScoringTeamsData.bowlingPlayers = tempBattingPlayers;
      this.liveScoringTeamsData.bowlingTeamName = tempName;
    } else if (inningNum == 3 && this.followOnMatch) {
      // swap batting/bowling team
      const tempBattingPlayers = this.liveScoringTeamsData.battingPlayers;
      const tempName = this.liveScoringTeamsData.battingTeamName;

      this.liveScoringTeamsData.battingPlayers = this.liveScoringTeamsData.bowlingPlayers;
      this.liveScoringTeamsData.battingTeamName = this.liveScoringTeamsData.bowlingTeamName;

      this.liveScoringTeamsData.bowlingPlayers = tempBattingPlayers;
      this.liveScoringTeamsData.bowlingTeamName = tempName;
    } else if (inningNum == 4) {
      // swap batting/bowling team
      const tempBattingPlayers = this.liveScoringTeamsData.battingPlayers;
      const tempName = this.liveScoringTeamsData.battingTeamName;

      this.liveScoringTeamsData.battingPlayers = this.liveScoringTeamsData.bowlingPlayers;
      this.liveScoringTeamsData.battingTeamName = this.liveScoringTeamsData.bowlingTeamName;

      this.liveScoringTeamsData.bowlingPlayers = tempBattingPlayers;
      this.liveScoringTeamsData.bowlingTeamName = tempName;
    }
  }

  async openActionsModal() {
    this.actionsData.ballsLength = this.currentInningBalls.length;
    this.actionsData.canAddPlayers = this.liveScoringTeamsData.canAddPlayers;
    this.actionsData.seriesType = this.matchData.seriesType;
    this.actionsData.disableOnStrikePopup = this.userPreferences.disableOnStrikePopup;
    this.actionsData.inningsNumber = this.ballConfig.inningsNumber;
    this.actionsData.clubStructure = this.liveScoringTeamsData.clubStructure;
    this.actionsData.isDls = this.liveScoringTeamsData.isDls;
    // this.actionsData.continueInning = this.matchConfig.continueInning;
    /* open scoring-actions in modal to get data back to this page when modal closed */
    const modal = await this.modalController.create({
      component: ActionsComponent,
      cssClass: '',
      componentProps: {
        actionType: this.currentStats.actionType,
        actionsData: this.actionsData
      }
    });
    await modal.present();

    const resp: any = await modal.onDidDismiss();
    if (resp && resp.data && resp.data.actionsData) {
      this.currentStats.actionType = resp.data.actionType;
      // get latest values and set
      this.actionsData = resp.data.actionsData;
      // set in localstorage so that user doesn't need to set for every match
      this.userPreferences.disableOnStrikePopup = this.actionsData.disableOnStrikePopup;
      this.userPreferences.disableDirections = this.actionsData.disableDirections;
      this.userPreferences.disablePitchMap = this.actionsData.disablePitchMap;
      this.storage.set('userPreferences', this.userPreferences);

      if (resp.data.clickedProp == 'changeToss') {
        // open toss modal if changeToss pressed
        this.setTossModal();
      } else if (resp.data.clickedProp == 'addPlayers') {
        this.addPlayerModal();
      } else if (resp.data.clickedProp == 'removePlayers') {
        this.removePlayerModal();
      } else if (resp.data.clickedProp == 'addPlayersFromClub') {
        this.addPlayerFromClubModal();
      } else if (resp.data.clickedProp == 'changeMaxOvers') {
        this.changeMaxOvers();
      } else if (resp.data.clickedProp == 'changeRunForWide') {
        this.changeRunsForWideNoBall('Wide');
      } else if (resp.data.clickedProp == 'changeRunForNoBall') {
        this.changeRunsForWideNoBall('No Ball');
      } else if (resp.data.clickedProp == 'retireBatsman') {
        this.retireBatsman();
      } else if (resp.data.clickedProp == 'retireBowler') {
        this.retireBowler();
      } else if (resp.data.clickedProp == 'endOver') {
        this.actionEndOver();
      } else if (resp.data.clickedProp == 'delayedMatch') {
        this.actionDelayedMatch();
      } else if (resp.data.clickedProp == 'targetRuns') {
        this.actionTargetRuns();
      } 
    }
  }

  // this function is to delay the save ball API because 
  // it is sending the same clientId for all the balls saved from the for loop  
  threadSleep(delay) {
    const start = new Date().getTime();
    while (new Date().getTime() < start + delay);
  }

  actionEndOver() {
    if (this.ballConfig.ballNum < this.ccUtil.ballsPerOver) {
      for (let i = this.ballConfig.ballNum; i < this.ccUtil.ballsPerOver; i++) {
        this.threadSleep(5);
        this.addBowlerCountBalls();
      }
      this.saveBalls();
      this.calculateBallsInfo();
      this.calculateOver();
    }
  }

  addBowlerCountBalls() {
    const d = new Date();
    this.ballConfig.ballNum = this.ballConfig.ballNum + 1;
    // create ball object
    const ball:any = {
      ball: this.ballConfig.ballNum,
      runs: 0,
      comment: '',
      outMethod: '',
      outPerson: 0,
      wicketTaker1: 0,
      wicketTaker2: 0,
      isFour: false,
      isSix: false,
      ballId: 0,
      inningsNumber: this.ballConfig.inningsNumber,
      over: this.ballConfig.over,
      ballType: 'Bowler Count Ball',
      batsman: this.currentStats.batsman,
      runner: this.currentStats.runner,
      bowler: this.currentStats.bowler,
      direction: 'undefined;undefined;undefined',
      isSaved: false,
      clientId: d.valueOf(),
      ballRequestFrom: 'BowlerCountBallsApp',
      seriesType: this.currentBallObj.seriesType
    }
    // push this new ball
    this.currentInningBalls.push(ball);
  }

  async actionTargetRuns(){
    const maxOversInputs = this.createInputs(this.currentBallObj.over+1, this.liveScoringTeamsData.overs);

    const changeTargetAlert = await this.alertController.create({
      header: 'Change Target',
      backdropDismiss: false,
      inputs: [
        {
          name: 'overs',
          type: 'text',
          placeholder: '*Overs'
        },
        {
          name: 'runs',
          type: 'text',
          placeholder: '*Runs'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler:() => {
          }
        },
        {
          text: 'Save',
          handler: data => {
            if (data.runs == "" || data.overs == "") {
              this.ccUtil.presentToast('Please enter Target Overs and Target Runs');
              return false;
            }else {
              const matchInfo = {
                clubId: this.matchData.clubId,
                matchId: this.matchData.matchId,
                revisedTarget: data.runs,
                revisedOvers: data.overs
              }

              this.setTargetRuns(matchInfo);
            }
          }
        }
      ]
    });
    await changeTargetAlert.present();
  }

  async retireBatsman() {
    const changeMaxOversAlert = await this.alertController.create({
      header: 'Change Max Overs',
      backdropDismiss: false,
      inputs: [
        {
          type: 'radio',
          label: this.currentStats.batsmanName,
          value: this.currentStats.batsman
        },
        {
          type: 'radio',
          label: this.currentStats.runnerName,
          value: this.currentStats.runner
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler:() => {
          }
        },
        {
          text: 'Save',
          handler: data => {
            this.currentInningBalls[this.currentInningBalls.length-1].outPerson = data;
            this.currentInningBalls[this.currentInningBalls.length-1].outMethod = 'rt';
            this.currentInningBalls[this.currentInningBalls.length-1].isSaved = false;

            this.saveBalls();
            this.calculateBallsInfo();

            if (this.currentStats.batsman == data) {
              // batsman selected
              this.currentStats.batsman = 0;
              this.currentStats.batsmanName = undefined;
            } else {
              // runner selected
              this.currentStats.runner = 0;
              this.currentStats.runnerName = undefined;
            }
          }
        }
      ]
    });
    await changeMaxOversAlert.present();
  }

  async retireBowler() {
    const changeRetireBowlerAlert = await this.alertController.create({
      header: 'Retire Bowler',
      subHeader: 'Do you want to retire "' + this.currentStats.bowlerName + '" ?',
      backdropDismiss: false,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler:() => {
          }
        },
        {
          text: 'Save',
          handler: data => {
            this.isRetireBowler = true;
            this.currentStats.showSelectBowler = true;
          }
        }
      ]
    });
    await changeRetireBowlerAlert.present();
  }

  createInputs(startValue, noOfRadioButtons) {
    const theNewInputs = [];
    for (let i = startValue; i <= noOfRadioButtons; i++) {
      theNewInputs.push(
        {
          type: 'radio',
          label: ''+i,
          value: ''+i
        }
      );
    }
    return theNewInputs;
  }

  async changeMaxOvers() {
    const maxOversInputs = this.createInputs(this.currentBallObj.over+1, 100);

    const changeMaxOversAlert = await this.alertController.create({
      header: 'Change Max Overs',
      backdropDismiss: false,
      inputs: maxOversInputs,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler:() => {
          }
        },
        {
          text: 'Save',
          handler: data => {
            const matchInfo = {
              matchID: this.matchData.matchId,
              overs: data
            }
            this.setMatchData(matchInfo);
          }
        }
      ]
    });
    await changeMaxOversAlert.present();
  }

  async changeRunsForWideNoBall(ballType) {
    const runsInputs = this.createInputs(1, 10);

    const changeMaxOversAlert = await this.alertController.create({
      header: 'Change runs for ' + ballType,
      backdropDismiss: false,
      inputs: runsInputs,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler:() => {
          }
        },
        {
          text: 'Save',
          handler: data => {
            if (ballType == 'Wide') {
              this.actionsData.runsForWide = data;
            } else {
              // ballType == 'No Ball'
              this.actionsData.runsForNoBall = data;
            }
          }
        }
      ]
    });
    await changeMaxOversAlert.present();
  }

  saveLostOversForDLMatch(matchInfo){
    this.scoringService.saveDelayedMatchData(this.matchData.clubId, matchInfo)
    .subscribe((value: any) => {
      // hide loader
      this.loadingSpinner = false;
      // check response
      if (value.responseState && value.data) {
        console.log('value', value);
        this.getLiveScoringTeamsData(this.matchData);
      } else {
        console.log('Failed to call API');
        this.ccUtil.showError('Oops!!!', 'Something went wrong, Please try again later.');
      }
    }, (error) => {
      // hide loader
      this.loadingSpinner = false;
      console.log('Api error');
      if(error.name == 'HttpErrorResponse')
        this.ccUtil.fail_modal('Please check your Network Connection');
      else
        this.ccUtil.fail_modal(error.message);
    });
  }

  async saveDelayedMatchData(){
    const oversInputs = this.createInputs(1, this.liveScoringTeamsData.overs);

    const lostOversAlert = await this.alertController.create({
      header: 'Lost Overs',
      backdropDismiss: false,
      inputs: oversInputs,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler:() => {
          }
        },
        {
          text: 'Save',
          handler: data => {
            // Call DL API
            const matchInfo = {
              matchID: this.matchData.matchId,
              inningNum: this.ballConfig.inningsNumber,
              oversLost: data
            }
            this.saveLostOversForDLMatch(matchInfo);
          }
        }
      ]
    });
    await lostOversAlert.present();
  }

  async actionDelayedMatch(){
    const delayMatchlert = await this.alertController.create({
      header: 'Delay Match',
      subHeader: 'Are you sure is this a delayed Match?',
      backdropDismiss: false,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            // console.log('Confirm Cancel');
          }
        }, {
          text: 'Yes',
          handler: () => {
            this.saveDelayedMatchData();
          }
        }
      ]
    });
    await delayMatchlert.present();
  }

  async openManOfTheMatchModal() {
    /* open extras - wides in modal to get data back to this page when modal closed */
    const modal = await this.modalController.create({
      component: ManOfTheMatchComponent,
      cssClass: '',
      componentProps: {
        clubId: this.matchData.clubId,
        matchId: this.matchData.matchId
      }
    });
    await modal.present();

    const resp: any = await modal.onDidDismiss();
    if (resp) {
      // Redirect to scorecard page
      this.navCtrl.navigateRoot(['/scorecard'], { state: { matchData: this.matchData, scoringEndMatch: true} });
    }
  }

  async openDLChartModal() {
    /* open extras - wides in modal to get data back to this page when modal closed */
    const modal = await this.modalController.create({
      component: DlsChartPageComponent,
      cssClass: '',
      componentProps: {
        clubId: this.matchData.clubId,
        matchId: this.matchData.matchId
      }
    });
    await modal.present();

    const resp: any = await modal.onDidDismiss();
    if (resp && resp.data && resp.data) {
      // nothing to do, its just a modal to show chart data for DL matches
    }
  }

  async openWidesModal() {
    /* open extras - wides in modal to get data back to this page when modal closed */
    const modal = await this.modalController.create({
      component: WidesComponent,
      cssClass: '',
      componentProps: {
        extrasAsGoodBall: this.actionsData.extrasAsGoodBall
      }
    });
    await modal.present();

    const resp: any = await modal.onDidDismiss();
    if (resp && resp.data && resp.data.ballType) {
      // send params ballType, runs to create ball and save ball
      const tempRuns = resp.data.runs + (Number(this.actionsData.runsForWide) - 1);
      this.createBall(tempRuns, resp.data.ballType);
    }
  }

  async openNoBallsModal() {
    /* open extras - NoBalls in modal to get data back to this page when modal closed */
    const modal = await this.modalController.create({
      component: NoballsComponent,
      cssClass: '',
      componentProps: {
        extrasAsGoodBall: this.actionsData.extrasAsGoodBall
      }
    });
    await modal.present();

    const resp: any = await modal.onDidDismiss();
    if (resp && resp.data && resp.data.ballType) {
      const runs = resp.data.runs + (Number(this.actionsData.runsForNoBall) - 1);
      // send params ballType, runs to create ball and save ball
      this.createBall(runs, resp.data.ballType);
    }
  }

  async openExtrasModal(){
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
      let isBoundary = 'No';
      if (resp.data.isFour)
        isBoundary = 'isFour';
      else if (resp.data.isSix)
        isBoundary = 'isSix';
      // send params ballType, runs to create ball and save ball
      this.createBall(runs, resp.data.ballType, isBoundary);
    }
  }

  async openWikcketsModal() {
    const wicketData = {
      batsmanId: Number(this.currentStats.batsman),
      batsmanName: this.currentStats.batsmanName,
      runnerId: Number(this.currentStats.runner),
      runnerName: this.currentStats.runnerName,
      bowlerId: Number(this.currentStats.bowler),
      bowlerName: this.currentStats.bowlerName,
      bowlingTeam: this.liveScoringTeamsData.bowlingPlayers
    };
    /* open extras - NoBalls in modal to get data back to this page when modal closed */
    const modal = await this.modalController.create({
      component: WicketsComponent,
      cssClass: '',
      componentProps: {
        wicketData,
        extrasAsGoodBall: this.actionsData.extrasAsGoodBall
      }
    });
    await modal.present();

    const resp: any = await modal.onDidDismiss();
    if (resp && resp.data) {
      const data = resp.data;
      this.ballConfig.substituteName = data.substituteName;
      let ballType = 'Good Ball';
      this.ballConfig.outMethod = data.wicketType;
      if (data.wicketType == 'mk') {
        this.ballConfig.outPerson = this.currentStats.runner;
      } else {
        this.ballConfig.outPerson = this.currentStats.batsman;
      }
      this.ballConfig.wicketTaker1 = this.currentStats.bowler;
      if (data.wicketType == 'ct' || data.wicketType == 'ctw' || data.wicketType == 'st' || data.wicketType=='ht') {
        if ((data.wicketType == 'st' || data.wicketType=='ht') && data.wide == true) {
          ballType = 'Wide';
          data.runs = 1;
        }
        if (data.wicketType!='ht') {
          this.ballConfig.wicketTaker2 = data.wicketTaker1;
        }
      } else if (data.wicketType == 'obf') {
        this.ballConfig.outPerson = data.outPerson;
        if (data.ballType)
          ballType = data.ballType;
      } else if (data.wicketType == 'ro') {
        this.ballConfig.outPerson = data.outPerson;
        this.ballConfig.wicketTaker1 = data.wicketTaker1;
        this.ballConfig.wicketTaker2 = data.wicketTaker2;
        if (data.ballType)
          ballType = data.ballType;
        } else if (data.wicketType == 'to' || data.wicketType == 'mk' || data.wicketType == 'rto') {
        ballType = 'No Count Ball';
      }
      this.outPlayers[this.ballConfig.outPerson] = this.ballConfig.outPerson;

      let isBoundary = 'No';
      if (data.isFour)
        isBoundary = 'isFour';
      else if (data.isSix)
        isBoundary = 'isSix';

      // set out person
      this.outPlayers[data.outPerson] = data.outPerson;
      // disable score keyboard
      this.disableScoreKeypad = true;

      // send params ballType, runs to create ball and save ball
      this.createBall(data.runs, ballType, isBoundary);
    }
  }

  async openPitchMapDirectionsModal(ball) {
    /* open extras - wides in modal to get data back to this page when modal closed */
    const modal = await this.modalController.create({
      component: PitchmapDirectionsComponent,
      cssClass: '',
      componentProps: {
        disableWagonWheel: this.actionsData.disableDirections,
        disablePitchMap: this.actionsData.disablePitchMap
      }
    });
    await modal.present();

    const resp: any = await modal.onDidDismiss();
    if (resp && resp.data) {
      ball.direction = resp.data.direction ? resp.data.direction : '';
      ball.pitchMapData = resp.data.pitchMapData ? resp.data.pitchMapData : '';
      // send params ballType, runs to create ball and save ball
      this.saveNewCreatedBall(ball);
      // get current over balls
      this.getCurrentOver();
    }
  }

  getRemainingText():String{
    let str:any = '';
    str = 'in ' + (parseInt(this.liveScoringTeamsData.overs)*this.ccUtil.ballsPerOver-this.currentStats['battingTeamScore'].balls) + ' balls(' +  this.ccUtil.formulaOver((parseInt(this.liveScoringTeamsData.overs)*this.ccUtil.ballsPerOver)-this.currentStats['battingTeamScore'].balls)+'-Ov)' 
    return str;
  }

  getDLTarget():String{
    let str:any = '';
    let targetBalls = this.ccUtil.formulaOverToBalls(this.liveScoringTeamsData.t2RevisedOvers);

    str = this.liveScoringTeamsData.t2Target - this.currentStats['battingTeamScore'].runs + ' run(s)';
    str += ' in ' + this.ccUtil.formulaOver(parseInt(targetBalls)-this.currentStats['battingTeamScore'].runs) +'/';
    if (Object.keys(this.liveScoringTeamsData.battingPlayers).length > 11) {
      str += (10 - this.currentStats['battingTeamScore'].wickets)+ '';
    } else {
      str += (Object.keys(this.liveScoringTeamsData.battingPlayers).length-1 - this.currentStats['battingTeamScore'].wickets)+ '';
    }
    return str;
  }

  getParScore() {
    this.scoringService.getParScoreBallbyBall(this.matchData.clubId, this.matchData.matchId)
    .subscribe((value: any) => {
      // check response
      if (value.responseState && value.data) {
        console.log('value', value);
        this.currentStats.parScore = value.data;
      } else {
        console.log('Failed to call API');
        if(value.errorMessage){
          this.errorMessage = value.errorMessage;
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

  async openEditBallsModal() {
    if (this.ballsData) {
      // Copying Circular Objects - to avoid reference changes affect to origional object
      const ballObj = JSON.parse(JSON.stringify(this.ballsData));

      /* open edit-balls in modal to get data back to this page when modal closed */
      const modal = await this.modalController.create({
        component: EditBallsComponent,
        cssClass: '',
        componentProps: {
          ballsDataObj: ballObj,
          actionsData: this.actionsData,
          nonDisplayBallsArr: this.nonDisplayBallsArr,
          currentBallObj: this.currentBallObj,
          bowlingPlayers: Object.assign({}, this.liveScoringTeamsData.bowlingPlayers),
          battingPlayers: Object.assign({}, this.liveScoringTeamsData.battingPlayers)
        }
      });
      await modal.present();

      const resp: any = await modal.onDidDismiss();
      if (resp && resp.data && resp.data.ballsDataObj) {
        // changes may made in ballsDataObj - and saved by user - copy ballsDataObj to origional object ballsData - to keep it updated
        this.ballsData = resp.data.ballsDataObj;
        // deleteBallsFromEdit
        this.ballToDeleteClientIdArr = resp.data.deleteBallsFromEdit;
        // call save balls
        this.saveBalls();
        this.calculateBallsInfo();
        // get current over balls
        this.getCurrentOver();
      }
    }
  }

  superOver(){
    this.openAddCommentModal('superOver');
  }

  async openAddCommentModal(matchType?) {
    /* open add-comment in modal to get data back to this page when modal closed */
    const modal = await this.modalController.create({
      component: AddCommentComponent,
      cssClass: '',
      componentProps: {
        matchType: matchType
      }
    });
    await modal.present();

    const resp: any = await modal.onDidDismiss();
    if (resp && resp.data && resp.data.comments) {
      //
      if (resp.data.matchLevel) {
        this.saveMatchLevelComments(resp.data.comments);
      } else {
        this.currentInningBalls[this.currentInningBalls.length-1].comment = resp.data.comments;
        this.currentInningBalls[this.currentInningBalls.length-1].isSaved = false;
      }
      this.saveBalls();
    }
  }

  saveMatchLevelComments(comment) {
    // create ball object
    const ball: any = {
      ball: 0,
      runs: 0,
      ballType: '',
      comment: '',
      outMethod: '',
      outPerson: 0,
      wicketTaker1: 0,
      wicketTaker2: 0,
      isFour: false,
      isSix: false,
    };

    ball.ballRequestFrom = 'matchLevelComment';
    ball.ballType = 'No Count Ball';
    ball.comment = comment;

    this.saveNewCreatedBall(ball);
  }

  async setTossModal() {
    /* open toss component page in modal to get data back to this page when modal closed */
    const modal = await this.modalController.create({
      component: TossComponent,
      cssClass: '',
      componentProps: {
        matchData: this.matchData,
        liveScoringTeamsData: this.liveScoringTeamsData
      }
    });
    await modal.present();

    const resp: any = await modal.onDidDismiss();
    if (resp && resp.data && resp.data.tossWon) {
      // print resp.data
      console.log('resp.data', resp.data);
      const matchInfo ={
        matchID: this.matchData.matchId,
        tossWon: resp.data.tossWon,
        battingFirst: resp.data.battingFirst
      }
      // set data to local match Object
      this.matchData.tossWon = resp.data.tossWon;
      this.matchData.battingFirst = resp.data.battingFirst;

      // Initially batting team is team 1 and second inning it reverse
      // set batting team and bowling team
      // this.mapTeams();

      // display select box to select batsman, runner, bowler etc.
      // this.checkBlocks();

      // set match data after toss is being done
      this.setMatchData(matchInfo);
    } else {
      this.navCtrl.back();
    }
  }

  getUserPreferencesFromLocal() {
    this.storage.get('userPreferences').then(
      data => {
        if(data){
          this.userPreferences = data;
          if (data.disableDirections)
            this.actionsData.disableDirections = data.disableDirections;
          if (data.disablePitchMap)
            this.actionsData.disablePitchMap = data.disablePitchMap;
        } else {
          this.userPreferences.disableOnStrikePopup = false;
        }
      }
    );

    // get wideRuns
    this.storage.get(this.matchData.matchId+'-wideRuns').then(
      data => {
        if(data) {
          this.actionsData.runsForWide = data;
        }
      }
    );
    // get noballRuns
    this.storage.get(this.matchData.matchId+'-noballRuns').then(
      data => {
        if(data) {
          this.actionsData.runsForNoBall = data;
        }
      }
    );
  }

  // setTeamsData(team, toss){
  //   if(team == 1 && toss == 'batting'){
  //     this.teams[1].id = this.liveScoringTeamsData.teamOne;
  //     this.teams[2].id = this.liveScoringTeamsData.teamTwo;
  //     this.teams[1].name = this.liveScoringTeamsData.teamOneName;
  //     this.teams[2].name = this.liveScoringTeamsData.teamTwoName;
  //     this.teams[1].players = this.liveScoringTeamsData.players1;
  //     this.teams[2].players = this.liveScoringTeamsData.players2;
  //   }else{
  //     this.teams[1].id = this.liveScoringTeamsData.teamTwo;
  //     this.teams[2].id = this.liveScoringTeamsData.teamOne;
  //     this.teams[1].name = this.liveScoringTeamsData.teamTwoName;
  //     this.teams[2].name = this.liveScoringTeamsData.teamOneName;
  //     this.teams[1].players = this.liveScoringTeamsData.players2;
  //     this.teams[2].players = this.liveScoringTeamsData.players1;
  //   }
  // }

  // mapTeams() {
  //   if(this.testMatch) {
  //     if(this.liveScoringTeamsData){
  //       if(this.innings[4].length || this.matchConfig.state == "FourthInning"){
  //         if(this.followOnMatch == 1){
  //           this.setTeamsData(1, 'batting');
  //         } else {
  //           this.setTeamsData(2, 'batting');
  //         }
  //       }else if(this.innings[3].length || this.matchConfig.state == "ThirdInning"){
  //         if(this.followOnMatch == 1){
  //           this.setTeamsData(2, 'batting');
  //         } else {
  //           this.setTeamsData(1, 'batting');
  //         }
  //       } else if(this.innings[2].length || this.matchConfig.state == "SecondInning"){
  //         this.setTeamsData(2, 'batting');
  //       }else{
  //         this.setTeamsData(1, 'batting');
  //       }
  //     }
  //   } else {
  //     if(this.liveScoringTeamsData){
  //       if(this.innings[2].length || this.matchConfig.state == "SecondInning"){
  //       // if(this.innings[2].length){
  //         this.setTeamsData(2, 'batting');
  //       }else{
  //         this.setTeamsData(1, 'batting');
  //       }
  //     }
  //   }
  // }

  setMatchData(matchInfo, callback?) {
    // send data to server
    this.errorMessage = '';
    // show loader
    this.loadingSpinner = true;
    // call an API
    this.scoringService.updateMatchData(this.matchData.clubId, this.matchData.matchId, matchInfo)
    .subscribe((value: any) => {
      // hide loader
      this.loadingSpinner = false;
      // check response
      if (value.responseState && value.data) {
        console.log('value', value);
        this.getLiveScoringTeamsData(this.matchData);
        // do callback
        if (callback) { callback(value.data) };
      } else {
        console.log('Failed to call API');
        if(value.errorMessage){
          this.errorMessage = value.errorMessage;
        }
      }
    }, (error) => {
      // hide loader
      this.loadingSpinner = false;
      console.log('Api error');
      if(error.name == 'HttpErrorResponse')
        this.ccUtil.fail_modal('Please check your Network Connection');
      else
        this.ccUtil.fail_modal(error.message);
    });
  }

  setTargetRuns(matchInfo) {
    // show loader
    this.loadingSpinner = true;
    // call an API
    this.scoringService.updateRevisedTarget(matchInfo)
    .subscribe((value: any) => {
      // hide loader
      this.loadingSpinner = false;
      // check response
      if (value.responseState && value.data) {
        console.log('value', value);
        this.getLiveScoringTeamsData(this.matchData);
      } else {
        console.log('Failed to call API');
        if(value.errorMessage){
          this.errorMessage = value.errorMessage;
        }
      }
    }, (error) => {
      // hide loader
      this.loadingSpinner = false;
      console.log('Api error');
      if(error.name == 'HttpErrorResponse')
        this.ccUtil.fail_modal('Please check your Network Connection');
      else
        this.ccUtil.fail_modal(error.message);
    });
  }

  async addPlayerModal() {
    const modal = await this.modalController.create({
      component: AddPlayersComponent,
      cssClass: '',
      componentProps: {
        teamOneName: this.liveScoringTeamsData.teamOneName,
        teamTwoName: this.liveScoringTeamsData.teamTwoName,
        nonPlayingPlayers1: this.liveScoringTeamsData.nonPlayingPlayers1,
        nonPlayingPlayers2: this.liveScoringTeamsData.nonPlayingPlayers2
      }
    });
    await modal.present();

    const resp: any = await modal.onDidDismiss();
    if (resp && resp.data) {
      const matchInfo: any = {
        matchID: this.matchData.matchId
      }
      if (resp.data.selectedTeam1Players && resp.data.selectedTeam1Players.length > 0) {
        matchInfo.players1 = [...Object.keys(this.liveScoringTeamsData.players1), ...resp.data.selectedTeam1Players];
      }
      if (resp.data.selectedTeam2Players && resp.data.selectedTeam2Players.length > 0) {
        matchInfo.players2 = [...Object.keys(this.liveScoringTeamsData.players2), ...resp.data.selectedTeam2Players];
      }
      if (resp.data.team1NewPlayers && resp.data.team1NewPlayers.length > 0) {
        matchInfo.newPlayers1 = resp.data.team1NewPlayers;
      }
      if (resp.data.team2NewPlayers && resp.data.team2NewPlayers.length > 0) {
        matchInfo.newPlayers2 = resp.data.team2NewPlayers;
      }
      // set match data after toss is being done
      this.setMatchData(matchInfo, (data) => {
      });
    }
  }

  async removePlayerModal() {
    const modal = await this.modalController.create({
      component: RemovePlayersComponent,
      cssClass: '',
      componentProps: {
        teamOneName: this.liveScoringTeamsData.teamOneName,
        teamTwoName: this.liveScoringTeamsData.teamTwoName,
        players1: this.liveScoringTeamsData.players1,
        players2: this.liveScoringTeamsData.players2
      }
    });
    await modal.present();

    const resp: any = await modal.onDidDismiss();
    if (resp && resp.data) {
      const matchInfo: any = {
        matchID: this.matchData.matchId
      }
      if (resp.data.selectedTeam1PlayersToRemove && resp.data.selectedTeam1PlayersToRemove.length > 0) {
        // Remove selectedTeam1PlayersToRemove from this.liveScoringTeamsData.players1 and send remaining list to update
        matchInfo.players1 = Object.keys(this.liveScoringTeamsData.players1).filter((o) => !resp.data.selectedTeam1PlayersToRemove.includes(o));
      }
      if (resp.data.selectedTeam2PlayersToRemove && resp.data.selectedTeam2PlayersToRemove.length > 0) {
        matchInfo.players2 = Object.keys(this.liveScoringTeamsData.players2).filter((o) => !resp.data.selectedTeam2PlayersToRemove.includes(o));
      }
      // set match data after toss is being done
      this.setMatchData(matchInfo, (data) => {
      });
    }
  }

  async addPlayerFromClubModal() {
    const modal = await this.modalController.create({
      component: AddPlayersClubComponent,
      cssClass: '',
      componentProps: {
        teamsData: {
          clubId: this.matchData.clubId,
          teamOneName: this.liveScoringTeamsData.teamOneName,
          teamTwoName: this.liveScoringTeamsData.teamTwoName,
          teamOne: this.liveScoringTeamsData.teamOne,
          teamTwo: this.liveScoringTeamsData.teamTwo
        }
      }
    });
    await modal.present();

    const resp: any = await modal.onDidDismiss();
    if (resp && resp.data) {
      const matchInfo: any = {
        matchID: this.matchData.matchId
      }
      if (resp.data.selectedTeam1Players && resp.data.selectedTeam1Players.length > 0) {
        matchInfo.players1 = [...Object.keys(this.liveScoringTeamsData.players1), ...resp.data.selectedTeam1Players];
      }
      if (resp.data.selectedTeam2Players && resp.data.selectedTeam2Players.length > 0) {
        matchInfo.players2 = [...Object.keys(this.liveScoringTeamsData.players2), ...resp.data.selectedTeam2Players];
      }
      // set match data after toss is being done
      this.setMatchData(matchInfo, (data) => {
      });
    }
  }

  async openSelectPlayerModal(playerRole, isEdit?) {
    // return if modal is already opened
    if (this.modalSelectPlayerComponent) { return false; }

    console.log('this.liveScoringTeamsData', this.liveScoringTeamsData);
    // this.liveScoringTeamsData will return which team is batting which is bowling and based on that we will send player list to select player modal
    let playerList = [];
    if (playerRole == 'Batsman' || playerRole == 'Runner') {
      // assign list of team who is batting
      playerList = Object.assign({}, this.liveScoringTeamsData.battingPlayers);
      // remove existing selected players from list
      if (this.currentStats.batsman) {
        delete playerList[this.currentStats.batsman];
      }
      if (this.currentStats.runner) {
        delete playerList[this.currentStats.runner];
      }
      // remove out persons from player list
      for (const key in this.outPlayers) {
        if (playerList[key]) delete playerList[key];
      }
    } else if (playerRole == 'Bowler' || playerRole == 'Previous Bowler') {
      // assign list of team who is bowling, using .Object.assign() to copy without reference
      playerList = Object.assign({}, this.liveScoringTeamsData.bowlingPlayers);
      // remove previous bowler from list/remove existing selected players from list
      if (this.currentStats.bowler) {
        delete playerList[this.currentStats.bowler];
      }
      if (this.currentStats.prevBowler && isEdit) {
        delete playerList[this.currentStats.prevBowler];
      }
    }
    this.modalSelectPlayerComponent = true;
    /* open add-comment in modal to get data back to this page when modal closed */
    const modal = await this.modalController.create({
      component: SelectPlayerComponent,
      cssClass: 'select-player-modal',
      componentProps: {
        playerList,
        playerRole,
        prevBowler: this.currentStats.prevBowler,
        isEdit
      }
    });
    await modal.present();

    const resp: any = await modal.onDidDismiss();
    this.modalSelectPlayerComponent = false;
    if (resp && resp.data) {
      if (resp.data.addPlayer) {
        this.addPlayerModal();
      }
      else if (resp.data.selectedPlayer) {
        // check if player selected for edit OR new player selected
        if (!isEdit) {
          // here we will get selected player: 'selectedPlayer'
          if (playerRole != 'Bowler' || this.testMatch) {
            this.savePlayerDetailsBeforePlay(playerRole, resp.data.selectedPlayer, playerList);
          } else {
            // if it is a bowler, check BowlerMaxOvers and then allow to savePlayerDetailsBeforePlay
            this.checkBowlerMaxOvers(playerRole, resp.data.selectedPlayer, playerList);
          }
        } else {
          if (playerRole == 'Bowler' || playerRole == 'Previous Bowler') {
            this.doEditPlayer(playerRole, resp.data.selectedPlayer, resp.data.selectedOvers);
          } else {
            this.doEditPlayer(playerRole, resp.data.selectedPlayer);
          }
        }
      }
    }
  }

  doEditPlayer(playerRole, newPlayerId, selectedOvers?) {
    if (playerRole == 'Batsman' || playerRole == 'Runner') {
      let tempId: any;
      if (playerRole == 'Batsman') {
        tempId = this.currentStats.batsman;
        this.currentStats.batsman = newPlayerId;
      } else {
        tempId = this.currentStats.runner;
        this.currentStats.runner = newPlayerId;
      }

      this.currentInningBalls.forEach(ball => {
        if (ball['batsman'] == tempId) {
          ball.batsman = newPlayerId;
          ball.isSaved = false;
        }
        if (ball['runner'] == tempId) {
          ball.runner = newPlayerId;
          ball.isSaved = false;
        }
      });
    } else if (playerRole == 'Bowler' || playerRole == 'prevBowler') {
      const tempBowlerId = this.currentStats.bowler;
      this.currentStats.bowler = newPlayerId;

      this.currentInningBalls.forEach(ball => {
        if (selectedOvers == "currentOver") {
          if (ball['bowler'] == tempBowlerId && this.ballConfig.over == ball.over) {
            ball.bowler = newPlayerId;
            ball.isSaved = false;
          }
        } else {
          if (ball['bowler'] == tempBowlerId) {
            ball.bowler = newPlayerId;
            ball.isSaved = false;
          }
        }
      });
    }
    this.saveBalls();
    this.calculateBallsInfo();
  }

  async checkBowlerMaxOvers(playerRole, bowlerId, playerList) {
    const tempAveOvers = this.liveScoringTeamsData.overs / 5;
    let totalBalls = 0;
    this.currentInningBalls.forEach(ball => {
      if (ball['bowler'] == bowlerId) {
        if (this.goodBallsBowlerArr.includes(ball['ballType'])) {
          totalBalls = totalBalls + 1;
        }
      }
    });

    let overs = "0.0";
    if (totalBalls != 0) {
        overs = "" + Math.floor(totalBalls / this.ccUtil.ballsPerOver);
        overs += "." + (totalBalls % this.ccUtil.ballsPerOver);
    }

    if (Math.ceil(tempAveOvers) <= parseInt(overs)) {
      // if the bowler already played max overs - confirm before bowler selection
      const bowlerLimitAlert = await this.alertController.create({
        header: 'Bowler Overs',
        subHeader: 'Bowler bowled maximum number of overs, do you still want to continue?',
        backdropDismiss: false,
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              // console.log('Confirm Cancel');
            }
          }, {
            text: 'Yes',
            handler: () => {
              this.savePlayerDetailsBeforePlay(playerRole, bowlerId, playerList);
            }
          }
        ]
      });
      await bowlerLimitAlert.present();
    } else {
      this.savePlayerDetailsBeforePlay(playerRole, bowlerId, playerList);
    }
  }

  getBalls(matchData) {
    // send data to server
    this.errorMessage = '';
    // show loader
    this.loadingSpinner = true;
    // call an API
    this.scoringService.getBalls(matchData.clubId, matchData.matchId)
    .subscribe((value: any) => {
      // hide loader
      this.loadingSpinner = false;
      // check response
      if (value.responseState && value.data) {
        console.log('value', value);
        this.ballsData = value.data;
        // check if inning4Balls have any data
        if (this.ballsData.inning4Balls && this.ballsData.inning4Balls.length > 0) {
          // set teams
          this.setTeams(4);
          this.calculateInningScores(3);
          this.calculateInningScores(2);
          this.calculateInningScores(1);
        } else if (this.ballsData.inning3Balls && this.ballsData.inning3Balls.length > 0) {
          this.setTeams(3);
          this.calculateInningScores(2);
          this.calculateInningScores(1);
        } else if (this.ballsData.inning2Balls && this.ballsData.inning2Balls.length > 0) {
          this.setTeams(2);
          this.calculateInningScores(1);
        }
        // calculate balls info based on current inning info
        this.calculateBallsInfo();

        //check if Innings are getting ended
        this.checkInningOver();
        
        // get current over balls
        this.getCurrentOver();

        // calculate over only when this func not called from select player modal response to set new over
        this.calculateOver();

        // getLocalBalls from local storage and ask user to update unsaved balls - if found any in local
        this.getLocalBalls();
      } else {
        console.log('Failed to call API');
        if(value.errorMessage){
          this.errorMessage = value.errorMessage;
        }
      }
    }, (error) => {
      // hide loader
      this.loadingSpinner = false;
      console.log('Api error');
      if(error.name == 'HttpErrorResponse')
        this.ccUtil.fail_modal('Please check your Network Connection');
      else
        this.ccUtil.fail_modal(error.message);
    });
  }

  getCurrentOver() {
    this.currentOver = [];
    for (const ball of this.currentInningBalls) {
      if (!['Auto Comment Ball', 'Bowler Count Ball'].includes(ball.ballType)) {
        // current over balls
        if (ball.over == this.currentBallObj.over) {
          if (ball['ballType'] != "Add Penalties" && ball['ballType'] != "Remove Penalties") {
            this.currentStats['currentOverTotalRuns'] += parseInt(ball.runs);
          }
          this.currentOver.push(ball);
        }
      }
    }
  }

  calculateInningScores(inningNumber) {
    if (inningNumber == 1) {
      // initialize
      this.currentStats['inning1Scores'] = {runs: 0, wickets:0, balls:0, overs:0};
      // iterate and get other ball related info
      for (const ball of this.ballsData.inning1Balls) {
        if (ball.ballType !== 'Auto Comment Ball') {
          // team total runs
          if (ball.ballType == 'Remove Penalties') {
            this.currentStats['inning1Scores'].runs -= parseInt(ball.runs);
          } else {
            this.currentStats['inning1Scores'].runs += parseInt(ball.runs);
          }
          // team total balls
          if(this.goodBallsArr.includes(ball['ballType'])) {
            // if (ball['ball'] <= this.ccUtil.ballsPerOver)
              this.currentStats['inning1Scores'].balls += 1;
          }
          if (ball.outPerson && ball.outMethod != 'rt') {
            // team total wickets
            this.currentStats['inning1Scores'].wickets++;
          }
        }
      }
      // console.log(this.currentStats['inning1Scores']);
      this.currentStats['inning1Scores'].overs = this.ccUtil.formulaOver(this.currentStats['inning1Scores'].balls);
    } else if (inningNumber == 2) {
      // initialize
      this.currentStats['inning2Scores'] = {runs: 0, wickets:0, balls:0, overs:0};
      // iterate and get other ball related info
      for (const ball of this.ballsData.inning2Balls) {
        if (ball.ballType !== 'Auto Comment Ball') {
          // team total runs
          if (ball.ballType == 'Remove Penalties') {
            this.currentStats['inning2Scores'].runs -= parseInt(ball.runs);
          } else {
            this.currentStats['inning2Scores'].runs += parseInt(ball.runs);
          }
          // team total balls
          if(this.goodBallsArr.includes(ball['ballType'])) {
            // if (ball['ball'] <= this.ccUtil.ballsPerOver)
              this.currentStats['inning2Scores'].balls += 1;
          }
          if (ball.outPerson && ball.outMethod != 'rt') {
            // team total wickets
            this.currentStats['inning2Scores'].wickets++;
          }
        }
      }
      this.currentStats['inning2Scores'].overs = this.ccUtil.formulaOver(this.currentStats['inning2Scores'].balls);
    } else if (inningNumber == 3) {
      // initialize
      this.currentStats['inning3Scores'] = {runs: 0, wickets:0, balls:0, overs:0};
      // iterate and get other ball related info
      for (const ball of this.ballsData.inning3Balls) {
        if (ball.ballType !== 'Auto Comment Ball') {
          // team total runs
          if (ball.ballType == 'Remove Penalties') {
            this.currentStats['inning3Scores'].runs -= parseInt(ball.runs);
          } else {
            this.currentStats['inning3Scores'].runs += parseInt(ball.runs);
          }
          // team total balls
          if(this.goodBallsArr.includes(ball['ballType'])) {
            // if (ball['ball'] <= this.ccUtil.ballsPerOver)
              this.currentStats['inning3Scores'].balls += 1;
          }
          if (ball.outPerson && ball.outMethod != 'rt') {
            // team total wickets
            this.currentStats['inning3Scores'].wickets++;
          }
        }
      }
      this.currentStats['inning3Scores'].overs = this.ccUtil.formulaOver(this.currentStats['inning3Scores'].balls);
    } else if (inningNumber == 4) {
      // initialize
      this.currentStats['inning4Scores'] = {runs: 0, wickets:0, balls:0, overs:0};
      // iterate and get other ball related info
      for (const ball of this.ballsData.inning4Balls) {
        if (ball.ballType !== 'Auto Comment Ball') {
          // team total runs
          if (ball.ballType == 'Remove Penalties') {
            this.currentStats['inning4Scores'].runs -= parseInt(ball.runs);
          } else {
            this.currentStats['inning4Scores'].runs += parseInt(ball.runs);
          }
          // team total balls
          if(this.goodBallsArr.includes(ball['ballType'])) {
            // if (ball['ball'] <= this.ccUtil.ballsPerOver)
              this.currentStats['inning4Scores'].balls += 1;
          }
          if (ball.outPerson && ball.outMethod != 'rt') {
            // team total wickets
            this.currentStats['inning4Scores'].wickets++;
          }
        }
      }
      this.currentStats['inning4Scores'].overs = this.ccUtil.formulaOver(this.currentStats['inning4Scores'].balls);
    }
  }

  calculateBallsInfo() {
    this.currentBallObj = {};
    // check if inning4Balls have any data
    if ((this.ballsData.inning4Balls && this.ballsData.inning4Balls.length > 0)  || this.ballConfig.inningsNumber == 4) {
      this.currentInningBalls = this.ballsData.inning4Balls;
    } else if ((this.ballsData.inning3Balls && this.ballsData.inning3Balls.length > 0) || this.ballConfig.inningsNumber == 3) {
      // check if inning4Balls have any data
      this.currentInningBalls = this.ballsData.inning3Balls;
    } else if ((this.ballsData.inning2Balls && this.ballsData.inning2Balls.length > 0) || this.ballConfig.inningsNumber == 2) {
      // check if inning2Balls have any data
      this.currentInningBalls = this.ballsData.inning2Balls;
    } else if ((this.ballsData.inning1Balls && this.ballsData.inning1Balls.length > 0) || this.ballConfig.inningsNumber == 1) {
      // check if inning1Balls have any data
      this.currentInningBalls = this.ballsData.inning1Balls;
    }
    // check length to make sure array is not empty
    if (this.currentInningBalls.length > 0) {
      // get last ball info to get player id and player details
      this.currentBallObj = this.currentInningBalls[this.currentInningBalls.length - 1];
      // if (this.currentBallObj.ballType !== 'Auto Comment Ball' && !notCalculateCurrOver) {
      //   // set ball num and over in local object
      //   this.ballConfig.ballNum = this.currentBallObj.ball;
      //   this.ballConfig.over = this.currentBallObj.over;
      // }
      this.ballConfig.inningsNumber = this.currentBallObj.inningsNumber;

      this.currentStats['currentOverTotalRuns'] = 0;
      this.currentStats['battingTeamScore'] = {runs: 0, wickets:0, balls:0, overs:0};
      // this.currentStats['inning1Scores'] = {runs: 0, wickets:0, balls:0, overs:0};

      // set playerId for batsman, runner and bowler
      // if (!this.currentStats['batsman'] && !this.currentStats['runner'] && !this.currentStats['bowler']) {
        this.currentStats.batsman = this.currentBallObj.batsman;
        this.currentStats.runner = this.currentBallObj.runner;
        this.currentStats.bowler = this.currentBallObj.bowler;
        // set playerName for batsman, runner and bowler
        this.currentStats.batsmanName = this.liveScoringTeamsData.battingPlayers[this.currentStats.batsman];
        this.currentStats.runnerName = this.liveScoringTeamsData.battingPlayers[this.currentStats.runner];
        this.currentStats.bowlerName = this.liveScoringTeamsData.bowlingPlayers[this.currentStats.bowler];
      // }
      if (this.currentBallObj.outMethod != 'ro') {
        this.changeStriker(this.currentBallObj);
      }

      // remove the person who got out from the current stats so that the select batsman option will come.
      if (this.currentBallObj.outPerson) {
        if (this.currentStats.batsman == this.currentBallObj.outPerson) {
          this.currentStats.batsman = 0;
          this.currentStats.batsmanName = undefined;
        } else {
          this.currentStats.runner = 0;
          this.currentStats.runnerName = undefined;
        }
      }

      this.currentStats.prevBowler = undefined;
      this.currentStats.prevBowlerName = undefined;
      // initialize
      this.currentStats.batsmanObj = {runs:0, balls:0, fours:0, sixes:0, sr:'0.00'};
      this.currentStats.runnerObj = {runs:0, balls:0, fours:0, sixes:0, sr:'0.00'};
      this.currentStats.bowlerObj = {balls:0, overs:0, maidens:0, runs:0, wickets:0, econ:'0.00'};
      this.currentStats.prevBowlerObj = {balls:0, overs:0, maidens:0, runs:0, wickets:0, econ:'0.00'};

      if (this.currentStats['batsmanName'] && this.currentStats['runnerName'] && this.currentStats['bowlerName']) {
        // enable keypad to score
        this.disableScoreKeypad = false;
      }

      let bowlerBalls = 0; let bowlerRuns = 0;
      let prevBowlerBalls = 0; let prevBowlerRuns = 0;
      // let currentBall = 0;

      const previousOver = (this.currentBallObj.over > 0) ? (this.currentBallObj.over - 1) : -1;
      if (previousOver > -1) {
        const prevBowlObj = this.currentInningBalls.find((o) => o.over == previousOver && o.bowler > 0);
        this.currentStats['prevBowler'] = prevBowlObj.bowler;
        this.currentStats['prevBowlerName'] = this.liveScoringTeamsData.bowlingPlayers[prevBowlObj.bowler];
      }

      // for (const ball of this.currentInningBalls.slice().reverse()) {
      //   if (currentBall && currentBall !== ball.bowler) {
      //     // assign currentBowler in prevBowler
      //     this.currentStats['prevBowler'] = ball.bowler;
      //     this.currentStats['prevBowlerName'] = this.liveScoringTeamsData.bowlingPlayers[this.currentStats['prevBowler']];
      //     currentBall = ball.bowler;
      //   }
      //   // current ball
      //   if (!currentBall) {
      //     currentBall = ball.bowler;
      //   }

      //   // if (!this.currentStats['prevBowler'] && this.currentBallObj.bowler !== ball.bowler) {
      //   //   // assign currentBowler in prevBowler
      //   //   this.currentStats['prevBowler'] = ball.bowler;
      //   //   this.currentStats['prevBowlerName'] = this.liveScoringTeamsData.bowlingPlayers[this.currentStats['prevBowler']];
      //   // }
      // }

      // iterate and get other ball related info
      for (const ball of this.currentInningBalls) {
        if (ball.ballType !== 'Auto Comment Ball') {
          // current over balls
          // if (ball.over == this.currentBallObj.over) {
          //   if (ball['ballType'] != "Add Penalties" || ball['ballType'] != "Remove Penalties") {
          //     this.currentStats['currentOverTotalRuns'] += parseInt(ball.runs);
          //   }
          //   this.currentOver.push(ball);
          // }
          // team total runs
          if (ball.ballType == 'Remove Penalties') {
            this.currentStats['battingTeamScore'].runs -= parseInt(ball.runs);
          } else {
            this.currentStats['battingTeamScore'].runs += parseInt(ball.runs);
          }
          // team total balls
          if(this.goodBallsArr.includes(ball['ballType'])) {
            if (ball['ball'] <= this.ccUtil.ballsPerOver)
              this.currentStats['battingTeamScore'].balls += 1;
          }
          if (ball.outPerson && ball.outMethod != 'rt') {
            // out players list
            this.outPlayers[ball.outPerson] = ball.outPerson;
            // team total wickets
            this.currentStats['battingTeamScore'].wickets++;
          }
          // match playerId for batsman, bowler and runner
          if (this.currentStats['batsman'] == ball.batsman) {
            this.currentStats['batsmanObj'].runs += this.getRunsOfBatsMan(ball);

            this.currentStats['batsmanObj'].balls += this.goodBallsBatsmanArr.includes(ball['ballType']) ? 1 : 0;

            this.currentStats['batsmanObj'].fours += ball.isFour ? 1 : 0;
            this.currentStats['batsmanObj'].sixes += ball.isSix ? 1 : 0;

            // runner SR
            if (this.currentStats['batsmanObj'].runs > 0 && this.currentStats['batsmanObj'].balls > 0) {
              this.currentStats['batsmanObj'].sr = (this.currentStats['batsmanObj'].runs * 100 / this.currentStats['batsmanObj'].balls).toFixed(2).toString();
            } else {
              this.currentStats['batsmanObj'].sr = '0.00';
            }
          }
          if (this.currentStats['runner'] == ball.batsman) {
            this.currentStats['runnerObj'].runs += this.getRunsOfBatsMan(ball);

            this.currentStats['runnerObj'].balls += this.goodBallsBatsmanArr.includes(ball['ballType']) ? 1 : 0;

            this.currentStats['runnerObj'].fours += ball.isFour ? 1 : 0;
            this.currentStats['runnerObj'].sixes += ball.isSix ? 1 : 0;

            // runner SR
            if (this.currentStats['runnerObj'].runs > 0 && this.currentStats['runnerObj'].balls > 0) {
              this.currentStats['runnerObj'].sr = (this.currentStats['runnerObj'].runs * 100 / this.currentStats['runnerObj'].balls).toFixed(2).toString();
            } else {
              this.currentStats['runnerObj'].sr = '0.00';
            }
          }
          if (this.currentStats['bowler'] == ball.bowler) {

            this.currentStats['bowlerObj'].balls += this.goodBallsBowlerArr.includes(ball['ballType']) ? 1 : 0;

            // condition 1sr for bowler runs
            this.currentStats['bowlerObj'].runs += this.goodBallsBowlerRunsArr.includes(ball['ballType']) ? ball.runs : 0;
            // condition 2nd for bowler runs
            this.currentStats['bowlerObj'].runs += ['No Ball Leg Bye', 'No Ball Bye'].includes(ball['ballType']) ? 1 : 0;

            this.currentStats['bowlerObj'].wickets += (ball.outPerson > 0 && !['mk', 'ro', 'rto', 'rt', 'obf', 'to'].includes(ball.outMethod)) ? 1 : 0;

            // bowler Maidens
            if (['Good Ball', 'Bye', 'Leg Bye'].includes(ball['ballType'])) {
              bowlerBalls += 1;
            }
            if (this.goodBallsBowlerMaidensArr.includes(ball['ballType'])) {
              bowlerRuns += parseInt(ball['runs']);
            }
            if (bowlerBalls == this.ccUtil.ballsPerOver) {
              if (bowlerRuns == 0) {
                this.currentStats['bowlerObj'].maidens += 1;
              }
              // reset
              bowlerRuns = 0;
              bowlerBalls = 0;
            }
          }

          if (this.currentStats['prevBowler'] == ball.bowler) {
            this.currentStats['prevBowlerObj'].balls += this.goodBallsBowlerArr.includes(ball['ballType']) ? 1 : 0;

            // condition 1sr for bowler runs
            this.currentStats['prevBowlerObj'].runs += this.goodBallsBowlerRunsArr.includes(ball['ballType']) ? ball.runs : 0;
            // condition 2nd for bowler runs
            this.currentStats['prevBowlerObj'].runs += ['No Ball Leg Bye', 'No Ball Bye'].includes(ball['ballType']) ? 1 : 0;

            this.currentStats['prevBowlerObj'].wickets += (ball.outPerson > 0 && !['mk', 'ro', 'rto', 'rt', 'obf', 'to'].includes(ball.outMethod)) ? 1 : 0;

            // bowler Maidens          
            if (['Good Ball', 'Bye', 'Leg Bye'].includes(ball['ballType'])) {
              prevBowlerBalls += 1;
            }
            if(this.goodBallsBowlerMaidensArr.includes(ball['ballType'])) {
              prevBowlerRuns += parseInt(ball['runs']);
            }
            if (prevBowlerBalls == this.ccUtil.ballsPerOver) {
              if (prevBowlerRuns == 0) {
                this.currentStats['prevBowlerObj'].maidens += 1;
              }
              // reset
              prevBowlerRuns = 0;
              prevBowlerBalls = 0;
            }
          }
        }
      }
      // get overs from balls count
      this.currentStats['bowlerObj'].overs = this.ccUtil.formulaOver(this.currentStats['bowlerObj'].balls);
      this.currentStats['prevBowlerObj'].overs = this.ccUtil.formulaOver(this.currentStats['prevBowlerObj'].balls);
      this.currentStats['battingTeamScore'].overs = this.ccUtil.formulaOver(this.currentStats['battingTeamScore'].balls);

      // bowler econ
      if (this.currentStats['bowlerObj'].runs > 0 && this.currentStats['bowlerObj'].balls > 0) {
        this.currentStats['bowlerObj'].econ = (this.currentStats['bowlerObj'].runs * this.ccUtil.ballsPerOver / this.currentStats['bowlerObj'].balls).toFixed(2).toString();
      } else {
        this.currentStats['bowlerObj'].econ = '0.00';
      }
      // prebowler econ
      if (this.currentStats['prevBowlerObj'].runs > 0 && this.currentStats['prevBowlerObj'].balls > 0) {
        this.currentStats['prevBowlerObj'].econ = (this.currentStats['prevBowlerObj'].runs * this.ccUtil.ballsPerOver / this.currentStats['prevBowlerObj'].balls).toFixed(2).toString();
      } else {
        this.currentStats['prevBowlerObj'].econ = '0.00';
      }
    }
    // calculate over only when this func not called from select player modal response
    // if (!notCalculateOver) {
    //   // to set new over
    //   this.calculateOver();
    // }
    if (!this.nonDisplayBallsArr.includes(this.currentBallObj.ballType)) {
      // check inning is ended or game is ended
      this.checkInningOver();
    }
  }

  checkInningOver(){
    if (this.testMatch) {
      this.checkTestMatchResults();
    } else if(this.twoXInnings) {
      // this.checkForTwoXInningsResults();
    } else {
      this.checkRegularMatchResults();
    }
  }

  checkForTwoXInningsResults() {
    if (this.ballConfig.inningsNumber == 2) {
      if (Number(this.ccUtil.formulaOver(this.currentStats['battingTeamScore'].balls)) == (parseInt(this.liveScoringTeamsData.overs)/2)) {
        this.currentStats.actionType = 'startThirdInning';
        this.calculateInningScores(2);
      } else {
        this.currentStats.actionType = 'inningRunning';
      }
    } else {
      if (Number(this.ccUtil.formulaOver(this.currentStats['battingTeamScore'].balls)) == (parseInt(this.liveScoringTeamsData.overs)/2)) {
        this.currentStats.actionType = 'startSecondInning';
        this.calculateInningScores(1);
      } else {
        this.currentStats.actionType = 'inningRunning';
      }
    }
    // if(this.innings[2].length || this.matchConfig.state == "SecondInning"){
    //   // if(this.global.formulaOver(this.currentStats.totalBalls) == this.liveScoringTeamsData.overs)
    //   if(this.global.isDLsMatch){
    //     if((Object.keys(this.outPlayers).length == Object.keys(this.teams[1].players).length - 1 || 
    //       this.global.formulaOver(this.currentStats.totalBalls) == this.DLTargetData.t2RevisedOvers || 
    //       this.currentStats.totalRuns >= this.DLTargetData.t2Target) && this.matchConfig.continueInning == 2){
    //       this.matchConfig.state = "GameEnded";
    //       this.checkBlocks();
    //     } else{
    //       this.matchConfig.state = "SecondInning";
    //     }
    //   }else{
    //     if((Object.keys(this.outPlayers).length == Object.keys(this.teams[1].players).length - 1 || 
    //       this.global.formulaOver(this.currentStats.totalBalls) == this.liveScoringTeamsData.overs) ||
    //       this.currentStats.totalRuns > this.matchConfig.firstInningRuns && this.matchConfig.continueInning == 2){
    //       this.matchConfig.state = "GameEnded";
    //       this.checkBlocks();
    //     } else{
    //       this.matchConfig.state = "SecondInning";
    //     }
    //   }
    // }else if(Object.keys(this.outPlayers).length == Object.keys(this.teams[1].players).length - 1 || this.global.formulaOver(this.currentStats.totalBalls) == this.liveScoringTeamsData.overs){
    //   this.matchConfig.state = "FirstInningEnded";
    //   this.matchConfig.FirstInningScore = this.currentStats.totalRuns+'/'+this.currentStats.totalWickets+'('+this.global.formulaOver(this.currentStats.totalBalls)+'/'+this.liveScoringTeamsData.overs+')';
    //   this.matchConfig.firstInningRuns = this.currentStats.totalRuns;
    //   this.calculateFirstInningScore();
    //   this.mapTeams();
    //   this.checkBlocks();
    // }else{
    //   this.checkBlocks();
    //   this.matchConfig.state = "FirstInning";
    // }
  }

  checkRegularMatchResults() {
    if (this.ballConfig.inningsNumber == 2) {
      if(this.liveScoringTeamsData.isDls){
        if(Object.keys(this.outPlayers).length == Object.keys(this.liveScoringTeamsData.battingPlayers).length - 1 || Number(this.ccUtil.formulaOver(this.currentStats['battingTeamScore'].balls)) == this.liveScoringTeamsData.t2RevisedOvers 
          || this.currentStats['battingTeamScore'].runs >= this.liveScoringTeamsData.t2Target){

          if(this.currentStats['battingTeamScore'].runs == this.liveScoringTeamsData.t2Target)
            this.currentStats.superOver = true;

            this.currentStats.actionType = 'endMatch';
        } else{
          this.currentStats.actionType = 'inningRunning';
        }
      } else {
        if (Object.keys(this.outPlayers).length == Object.keys(this.liveScoringTeamsData.battingPlayers).length - 1 || Number(this.ccUtil.formulaOver(this.currentStats['battingTeamScore'].balls)) == this.liveScoringTeamsData.overs 
          || this.currentStats['battingTeamScore'].runs > this.currentStats['inning1Scores'].runs) {
            
          if(this.currentStats['battingTeamScore'].runs == this.currentStats['inning1Scores'].runs)
            this.currentStats.superOver = true;
          this.currentStats.actionType = 'endMatch';
        } else {
          this.currentStats.actionType = 'inningRunning';
        }
      }
    } else {
      if ((Object.keys(this.outPlayers).length > 0 && (Object.keys(this.outPlayers).length == Object.keys(this.liveScoringTeamsData.battingPlayers).length - 1) || Number(this.ccUtil.formulaOver(this.currentStats['battingTeamScore'].balls)) == this.liveScoringTeamsData.overs)) {
        this.currentStats.actionType = 'startSecondInning';
      } else {
        this.currentStats.actionType = 'inningRunning';
      }
    }
  }

  checkTestMatchResults() {
    if(this.ballConfig.inningsNumber == 4) {
      // if (Object.keys(this.outPlayers).length == Object.keys(this.liveScoringTeamsData.battingPlayers).length - 1) {
      //   this.currentStats.actionType = 'endMatch';
      //   this.calculateInningScores(4);
      // } else {
      //   this.currentStats.actionType = 'inningRunning';
      // }
      let team1TotalI4;
      let team2TotalI4;
      if(this.followOnMatch == 1) {
        team1TotalI4 = parseInt(this.currentStats.inning1Scores.runs) + parseInt(this.currentStats.battingTeamScore.runs);
        team2TotalI4 = parseInt(this.currentStats.inning2Scores.runs) + parseInt(this.currentStats.inning3Scores.runs);
        if (Object.keys(this.outPlayers).length == Object.keys(this.liveScoringTeamsData.battingPlayers).length - 1 || team1TotalI4 > team2TotalI4) {
          this.currentStats.actionType = 'endMatch';
        }
      } else {
        team1TotalI4 = parseInt(this.currentStats.inning1Scores.runs) + parseInt(this.currentStats.inning3Scores.runs);
        team2TotalI4 = parseInt(this.currentStats.inning2Scores.runs) + parseInt(this.currentStats.battingTeamScore.runs);
        if (Object.keys(this.outPlayers).length == Object.keys(this.liveScoringTeamsData.battingPlayers).length - 1 || team2TotalI4 > team1TotalI4) {
          this.currentStats.actionType = 'endMatch';
        }
      }
    } else if(this.ballConfig.inningsNumber == 3) {
      // if (Object.keys(this.outPlayers).length == Object.keys(this.liveScoringTeamsData.battingPlayers).length - 1) {
      //   this.currentStats.actionType = 'startFourthInning';
      //   this.calculateInningScores(3);
      // } else {
      //   this.currentStats.actionType = 'inningRunning';
      // }
      let team1TotalI3;
      let team2TotalI3;
      if(this.followOnMatch == 1) {
        team1TotalI3 = parseInt(this.currentStats.inning1Scores.runs);
        team2TotalI3 = parseInt(this.currentStats.inning2Scores.runs) + parseInt(this.currentStats.battingTeamScore.runs);
        if(Object.keys(this.outPlayers).length == Object.keys(this.liveScoringTeamsData.battingPlayers).length - 1) {
          this.currentStats.actionType = 'startFourthInning';
          if(team1TotalI3 > team2TotalI3) {
            this.currentStats.actionType = 'endMatch';
          }
        }
      } else {
        team1TotalI3 = parseInt(this.currentStats.inning1Scores.runs) + parseInt(this.currentStats.battingTeamScore.runs);
        team2TotalI3 = parseInt(this.currentStats.inning2Scores.runs);
        if(Object.keys(this.outPlayers).length == Object.keys(this.liveScoringTeamsData.battingPlayers).length - 1) {
          this.currentStats.actionType = 'startFourthInning';
          if(team2TotalI3 > team1TotalI3){
            this.currentStats.actionType = 'endMatch';
          }
        }
      }
      this.calculateInningScores(3);
    } else if(this.ballConfig.inningsNumber == 2) {
      if (Object.keys(this.outPlayers).length == Object.keys(this.liveScoringTeamsData.battingPlayers).length - 1) {
        this.currentStats.actionType = 'startThirdInning';
        this.calculateInningScores(2);
      } else {
        this.currentStats.actionType = 'inningRunning';
      }
    } else {
      if (Object.keys(this.outPlayers).length == Object.keys(this.liveScoringTeamsData.battingPlayers).length - 1) {
        this.currentStats.actionType = 'startSecondInning';
        this.calculateInningScores(1);
      } else {
        this.currentStats.actionType = 'inningRunning';
      }
    }
  }

  redirectToScorecard() {
    // Redirect to scorecard page
    this.router.navigate(['/scorecard'], { state: { matchData: this.matchData} });
  }

  async setEndMatchData() {
    if(this.currentStats.superOver){
      const superOverEndMatchAlert = await this.alertController.create({
        header: 'Select Winner',
        backdropDismiss: false,
        inputs: [
          {
            type: 'radio',
            label: this.liveScoringTeamsData.teamOneName,
            value: this.liveScoringTeamsData.teamOne
          },
          {
            type: 'radio',
            label: this.liveScoringTeamsData.teamTwoName,
            value: this.liveScoringTeamsData.teamTwo
          },
          {
            type: 'radio',
            label: 'Split Points',
            value: 0
          }
        ],
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler:() => {
            }
          },
          {
            text: 'Save',
            handler: data => {
              const matchInfo = {
                matchID: this.matchData.matchId,
                winner: data,
                isComplete: 1
              }
              // set match data after toss is being done
              this.setMatchData(matchInfo, (data) => {
                if (data == 'success') {
                  // match has ended redirect to scorecard page.
                  // this.redirectToScorecard();
                  this.openManOfTheMatchModal();
                }
              });
            }
          }
        ]
      });
      await superOverEndMatchAlert.present();
    }else{
      const matchInfo = {
        matchID: this.matchData.matchId,
        // winner: data.teamWon,
        isComplete: 1
      }
      // set match data after toss is being done
      this.setMatchData(matchInfo, (data) => {
        if (data == 'success') {
          // match has ended redirect to scorecard page.
          // this.redirectToScorecard();
          this.openManOfTheMatchModal();
        }
      });
    }
  }

  async doEndMatch (isSuccess) {
    if (!isSuccess) {
      let endMatchAlert = await this.alertController.create({
        header: 'End Match',
        subHeader: 'There are some unsaved balls, can not end match. We will try to save the balls to server as soon as you are connected to network. Please try again.',
        backdropDismiss: false,
        buttons: ['Dismiss']                      
      });
      await endMatchAlert.present();
    } else {
      this.setEndMatchData();
    }
  }

  endMatch() {
    // 1. first we call saveUnsavedBalls
    const unsavedBalls = this.getUnsavedBalls(this.ballsData);
    if (unsavedBalls && unsavedBalls.length > 0) {
      unsavedBalls.forEach(ball => {
        // push ball data in current inning
        if (ball.inningsNumber == 1) {
          this.ballsData.inning1Balls.push(ball);
        } else if (ball.inningsNumber == 2) {
          this.ballsData.inning2Balls.push(ball);
        } else if (ball.inningsNumber == 3) {
          this.ballsData.inning3Balls.push(ball);
        } else if (ball.inningsNumber == 4) {
          this.ballsData.inning4Balls.push(ball);
        }
      });
      // 2. if saveBalls fails this will call doEndMatch()
      this.saveBalls(this.doEndMatch);
      this.calculateBallsInfo();
      // get current over balls
      this.getCurrentOver();
      // calculate over only when this func not called from select player modal response to set new over
      this.calculateOver();
    } else {
      this.setEndMatchData();
    }
  }

  doInning3() {
    // 2nd inning started
    this.ballConfig = {
      inningsNumber:3, over:0, ballNum:1, batsman:0, runner:0, bowler:0, outPerson:0, wicketTaker1:0, wicketTaker2:0,
      outMethod:''
    };
    // swap batting/bowling team
    this.setTeams(3);

    // switch scores
    this.currentStats.inning2Scores = this.currentStats.battingTeamScore;
    this.currentStats.battingTeamScore = {runs: 0, wickets:0, balls:0, overs:0};
    // reset all current stats data to default
    this.currentStats = this.getInitialCurrentStatsObj(this.currentStats);
    console.log('this.currentStats', this.currentStats);

    // initialize current over
    this.currentOver = [];
    this.outPlayers = {};
    // set for 2nd inning
    this.currentInningBalls = this.ballsData.inning3Balls;
  }

  getDlTargetInning1(){
    // send data to server
    this.errorMessage = '';
    // show loader
    this.loadingSpinner = true;
    // call an API
    this.scoringService.getDlTargetInning1(this.matchData.clubId, this.matchData.matchId, this.currentStats.inning1Scores.runs)
    .subscribe((value: any) => {
      // hide loader
      this.loadingSpinner = false;
      // check response
      if (value.responseState && value.data) {
        console.log('value', value);
        this.getLiveScoringTeamsData(this.matchData);
      } else {
        console.log('Failed to call API');
        if(value.errorMessage){
          this.errorMessage = value.errorMessage;
        }
      }
    }, (error) => {
      // hide loader
      this.loadingSpinner = false;
      console.log('Api error');
      if(error.name == 'HttpErrorResponse')
        this.ccUtil.fail_modal('Please check your Network Connection');
      else
        this.ccUtil.fail_modal(error.message);
    });
  }

  async startInning(inningNum) {
    if (inningNum == 2) {
      // 2nd inning started
      this.ballConfig = {
        inningsNumber:2, over:0, ballNum:1, batsman:0, runner:0, bowler:0, outPerson:0, wicketTaker1:0, wicketTaker2:0,
        outMethod:''
      };
      // swap batting/bowling team
      this.setTeams(2);

      // switch scores
      this.currentStats.inning1Scores = this.currentStats.battingTeamScore;
      this.currentStats.battingTeamScore = {runs: 0, wickets:0, balls:0, overs:0};
      // reset all current stats data to default
      this.currentStats = this.getInitialCurrentStatsObj(this.currentStats);
      console.log('this.currentStats', this.currentStats);

      // initialize current over
      this.currentOver = [];
      this.outPlayers = {};
      // set for 2nd inning
      this.currentInningBalls = this.ballsData.inning2Balls;
      if(this.liveScoringTeamsData.isDls){
        this.getDlTargetInning1();
      }
    } else if (inningNum == 3) {
      if (parseInt(this.currentStats.inning1Scores.runs) > parseInt(this.currentStats.battingTeamScore.runs)) {
        const followonAlert = await this.alertController.create({
          header: 'Follow On',
          subHeader: 'Is this Follow On Match?',
          backdropDismiss: false,
          buttons: [
            {
              text: 'No',
              handler: () => {
                // Reset the followOn
                const matchData = {
                  matchId: this.matchData.matchId,
                  isFollowon: 0,
                };
                this.setMatchData(matchData);
                this.followOnMatch = 0;
                this.doInning3();
              }
            },
            {
              text: 'Yes',
              handler: ()=>{
                const matchData = {
                  matchId: this.matchData.matchId,
                  isFollowon: 1,
                };
                this.setMatchData(matchData);
                this.followOnMatch = 1;
                this.doInning3();
              }
            }
          ]
        });
        await followonAlert.present();
      } else {
        this.doInning3();
      }
    } else if (inningNum == 4) {
      // 2nd inning started
      this.ballConfig = {
        inningsNumber:4, over:0, ballNum:1, batsman:0, runner:0, bowler:0, outPerson:0, wicketTaker1:0, wicketTaker2:0,
        outMethod:''
      };
      // swap batting/bowling team
      this.setTeams(4);

      // switch scores
      this.currentStats.inning3Scores = this.currentStats.battingTeamScore;
      this.currentStats.battingTeamScore = {runs: 0, wickets:0, balls:0, overs:0};
      // reset all current stats data to default
      this.currentStats = this.getInitialCurrentStatsObj(this.currentStats);
      console.log('this.currentStats', this.currentStats);

      // initialize current over
      this.currentOver = [];
      this.outPlayers = {};
      // set for 2nd inning
      this.currentInningBalls = this.ballsData.inning4Balls;
    }
  }

  getRunsOfBatsMan(ball) {
    let runs = 0;
    if (['No Ball of Bat', 'Good No Ball of Bat'].includes(ball['ballType'])) {
      runs = parseInt(ball['runs']) - 1;
    } else if(ball['ballType'] == 'Good Ball') {
      runs = parseInt(ball['runs']);
    } else {
      runs = 0;
    }
    return runs;
  }

  savePlayerDetailsBeforePlay(playerRole, selectedPlayer, playerList) {
    // create ball object
    const ball: any = {
      ball: 0,
      runs: 0,
      ballType: '',
      comment: '',
      outMethod: '',
      outPerson: 0,
      wicketTaker1: 0,
      wicketTaker2: 0,
      isFour: false,
      isSix: false
    };
    ball.ballRequestFrom = 'PlayerDetailsApp';

    if (playerRole == 'Batsman') {
      // set batsman info if player role is batsman
      ball.ballType = 'Auto Comment Ball';
      ball.comment = playerList[selectedPlayer] + ', comes to the crease.';
      // set ball config info
      this.currentStats.batsman = selectedPlayer;
      this.currentStats['batsmanName'] = this.liveScoringTeamsData.battingPlayers[selectedPlayer];
    }
    else if (playerRole == 'Runner') {
      // set runner info if player role is runner
      ball.ballType = 'Auto Comment Ball';
      ball.comment = playerList[selectedPlayer] + ', comes to the crease.';
      // set ball config info
      this.currentStats.runner = selectedPlayer;
      this.currentStats['runnerName'] = this.liveScoringTeamsData.battingPlayers[selectedPlayer];
    }
    else if (playerRole == 'Bowler') {
      // set bowler info if player role is bowler
      ball.ballType = 'Auto Comment Ball';
      ball.comment = playerList[selectedPlayer] + ', comes into the attack';
      // set ball config info
      this.currentStats.bowler = selectedPlayer;
      this.currentStats['bowlerName'] = this.liveScoringTeamsData.bowlingPlayers[selectedPlayer];
      if (this.ballConfig.over > 0 || this.ballConfig.ballNum >= this.ccUtil.ballsPerOver) {
        // do swap on over ended
        this.swapPlayers();
        // and confirm
        this.popupOnStrike();
      }
      // after each over when bowler selected reset currentOver
      if (!this.isRetireBowler) {
        this.currentOver = [];
      }
      this.isRetireBowler = false;

      this.currentStats.showSelectBowler = false;
    }

    if (this.currentStats['batsmanName'] && this.currentStats['runnerName'] && this.currentStats['bowlerName']) {
      // enable keypad to score
      this.disableScoreKeypad = false;
    }

    this.saveNewCreatedBall(ball);
  }

  async popupOnStrike() {
    if(!this.userPreferences.disableOnStrikePopup){
      const onStrikeAlert = await this.alertController.create({
        header: 'On Strike Batsman',
        subHeader: 'Is ' + this.currentStats.batsmanName + ' on Strike?', 
        backdropDismiss: false,
        buttons: [
          {
            text: 'No',
            handler:() => {
              this.swapPlayers();
            }
          },
          {
            text: 'Yes',
            role: 'cancel',
            handler:() => {
              //
            }
          }
        ]
      });
      await onStrikeAlert.present();
    }
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
      matchDate: this.matchData.date,
      teamOneId: this.matchData.teamOne,
      teamOneName: this.matchData.teamOneName,
      teamTwoId: this.matchData.teamTwo,
      teamTwoName: this.matchData.teamTwoName,
      balls: this.ballsData
    }
    this.storage.set(this.localStorageKey + 'save-balls', storeBallsData);
    // find unsaved balls and save it to server
    const unsavedBalls = this.getUnsavedBalls(this.ballsData);
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
          matchDate: this.matchData.date,
          teamOneId: this.matchData.teamOne,
          teamOneName: this.matchData.teamOneName,
          teamTwoId: this.matchData.teamTwo,
          teamTwoName: this.matchData.teamTwoName,
          balls: this.ballsData
        }
        this.storage.set(this.localStorageKey + 'save-balls', storeBallsData);
        // call callback - balls are stored
        if (callback) { callback(true); };
      } else {
        console.log('Failed to call API');
        if(value.errorMessage){
          this.errorMessage = value.errorMessage;
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

    if (this.ballToDeleteClientIdArr && this.ballToDeleteClientIdArr.length > 0) {
      // call delete API to delete undeleted balls from server
      this.deleteBallsFromServer();
    }
  }

  createBall(runs, ballType, isBoundry?) {
    // create ball object
    const ball: any = {
      runs,
      ballType,
      comment: '',
      outMethod: this.ballConfig.outMethod,
      outPerson: this.ballConfig.outPerson,
      wicketTaker1: this.ballConfig.wicketTaker1,
      wicketTaker2: this.ballConfig.wicketTaker2,
      isFour: (isBoundry && runs == 4) ? true : false,
      isSix: (isBoundry && runs == 6) ? true : false,
    };
    ball.ballRequestFrom = 'fromCreateBall';

    if (!this.actionsData.disableDirections || !this.actionsData.disablePitchMap) {
      // do save create ball inside openPitchMapDirectionsModal
      this.openPitchMapDirectionsModal(ball);
    } else {
      // directly save ball if disableDirections and disablePitchMap are disabled
      this.saveNewCreatedBall(ball);
      // get current over balls
      this.getCurrentOver();
    }
  }

  saveNewCreatedBall(ball) {
    // set ball num and over
    let currentOverCalculated = [];
    let lastBallObj: any = {};
    if (this.currentInningBalls && this.currentInningBalls.length > 0) {
      lastBallObj = this.currentInningBalls[this.currentInningBalls.length - 1];
      this.ballConfig.ballNum = lastBallObj.ball ? lastBallObj.ball : 1;
      this.ballConfig.over = lastBallObj.over ? lastBallObj.over : 0;

      currentOverCalculated = this.currentInningBalls.filter((o) => o.over == lastBallObj.over);

      if (currentOverCalculated.length >= this.ccUtil.ballsPerOver) {
        let goodballs = 0;
        for (const ballObj of currentOverCalculated) {
          if (this.goodBallsArr.includes(ballObj['ballType'])) {
            goodballs = goodballs + 1;
          }
        }
        if (goodballs >= this.ccUtil.ballsPerOver && !this.plusOneBall) {
          this.ballConfig.over = lastBallObj.over + 1;
          this.ballConfig.ballNum = 0;
        }
      }
      // reset plusOneBall
      this.plusOneBall = false;

        // increase ball num by 1 only if ball type is displayable ball
      if (!this.nonDisplayBallsArr.includes(ball.ballType)) {
        let previousBallType = '';
        if (currentOverCalculated && currentOverCalculated.length > 0) {
          previousBallType = currentOverCalculated[currentOverCalculated.length - 1].ballType;
        }
        let i = 1;
        while (this.nonDisplayBallsArr.includes(previousBallType) && i <= currentOverCalculated.length ) {
          previousBallType = currentOverCalculated[currentOverCalculated.length - i].ballType;
          i++;
        }
        if (this.goodBallsArr.includes(previousBallType) || this.ballConfig.ballNum == 0) {
          this.ballConfig.ballNum += 1;
        }
      }
    }

    const d = new Date();
    // add additional ball common params for good and non-good balls
    ball.ball = this.ballConfig.ballNum;
    ball.ballId = 0;
    ball.clientId = d.valueOf();
    ball.isSaved = false;
    ball.over = this.ballConfig.over;
    ball.inningsNumber = this.ballConfig.inningsNumber;
    // ball.direction = 'undefined;undefined;undefined';
    ball.seriesType = this.matchData.seriesType;
    ball.batsman = this.currentStats.batsman;
    ball.runner = this.currentStats.runner;
    ball.bowler = this.currentStats.bowler;
    ball.noBallCustomRuns = this.actionsData.runsForNoBall;

    // ball.previousPlayerId = previousPlayerId;

    // push ball data in current inning
    if (this.ballConfig.inningsNumber == 1) {
      this.ballsData.inning1Balls.push(ball);
    } else if (this.ballConfig.inningsNumber == 2) {
      this.ballsData.inning2Balls.push(ball);
    } else if (this.ballConfig.inningsNumber == 3) {
      this.ballsData.inning3Balls.push(ball);
    } else if (this.ballConfig.inningsNumber == 4) {
      this.ballsData.inning4Balls.push(ball);
    }

    // clear last wicket data
    this.resetWicketData();

    // call save balls
    this.saveBalls();

    // re-calculate balls info after each ball save clicked
    this.calculateBallsInfo();

    // calculate over only when this func not called from select player modal response to set new over
    this.calculateOver();

    // if (ball.outMethod != 'ro') {
    //   this.changeStriker(ball);
    // }
    if (ball.outMethod && ball.outMethod != '') {
      if (this.ballConfig.outPerson == this.currentStats.runner) {
        this.currentStats.runner = 0;
        this.currentStats.runnerName = undefined;
      } else {
        this.currentStats.batsman = 0;
        this.currentStats.batsmanName = undefined;
      }
    }
  }

  resetWicketData() {
    if (this.ballConfig.outPerson) {
      if (this.ballConfig.outPerson == this.ballConfig.batsman) {
        this.ballConfig.batsman = 0;
        this.currentStats.batsman = 0;
        this.currentStats.batsmanName = undefined;
      } else {
        this.ballConfig.runner = 0;
        this.currentStats.runner = 0;
        this.currentStats.runnerName = undefined;
      }
      // this.checkBlocks();
      this.ballConfig.outPerson = 0;
      this.ballConfig.outMethod = '';
      this.ballConfig.wicketTaker1 = 0;
      this.ballConfig.wicketTaker2 = 0;
    }
  }

  calculateOver() {
    // get last ball info to get player id and player details
    const lastBallObj = this.currentInningBalls[this.currentInningBalls.length - 1];

    const currentOverCalculated = this.currentInningBalls.filter((o) => o.over == lastBallObj.over);

    if (currentOverCalculated.length >= this.ccUtil.ballsPerOver) {
      let goodballs = 0;
      for (const ballObj of currentOverCalculated) {
        if (['Good Ball', 'Good Wide', 'Bye', 'Leg Bye', 'Good No Ball Bye', 'Good No Ball Leg Bye', 'Good No Ball', 'Good No Ball of Bat', 'Bowler Count Ball'].includes(ballObj['ballType'])) {
          goodballs = goodballs + 1;
        }
      }
      if (goodballs >= this.ccUtil.ballsPerOver && lastBallObj.ballType != 'Auto Comment Ball') {
        // this.currentStats.bowler = 0;
        // this.currentStats.bowlerName = undefined;
        this.currentStats.showSelectBowler = true;
        // disable button
        this.disableScoreKeypad = true;
        // reset bowler object
        // this.currentStats['bowlerObj'] = {balls:0, overs:0, maidens:0, runs:0, wickets:0, econ:'0.00'};
      }
    }
  }

  // store delete ball object in local storage - to retrieve deleted ball if in case API failed to save deleted ball
  // this.storage.get(this.localStorageKey + 'delete-balls').then((valArr) => {
  //   if (!valArr) {
  //     valArr = [];
  //   }
  // });

  deleteBalls() {
    if (this.currentInningBalls && this.currentInningBalls.length > 0) {
      const ballToDelete = this.currentInningBalls[this.currentInningBalls.length - 1];
      if (ballToDelete.clientId != 0) {
        const ballToDeleteClientId = ballToDelete.clientId;
        this.ballToDeleteClientIdArr.push(ballToDeleteClientId);

        // iterate all balls from the last and find 'Bowler Count Ball' to delete
        if (this.currentInningBalls.length-2 > 0) {
          for (let i = this.currentInningBalls.length-2; i>=0; i--) {
            if (this.currentInningBalls[i].ballType == 'Bowler Count Ball') {
              this.ballToDeleteClientIdArr.push(this.currentInningBalls[i].clientId);
              // remove
              this.currentInningBalls.splice(i, 1);
            } else {
              // will break for loop whenever ballType not equal to 'Bowler Count Ball'
              break;
            }
          }
        }

        // remove out player from list
        delete this.outPlayers[ballToDelete.batsman];

        let isAutoComment = false;
        if (ballToDelete.ballType == 'Auto Comment Ball' && ballToDelete.bowler != 0 && ballToDelete.batsman == 0 && ballToDelete.runner == 0) {
          this.ballConfig.bowler = 0;
          this.currentStats['bowlerName'] = undefined;
          // disable button
          this.disableScoreKeypad = true;
          // reset bowler object
          // this.currentStats['bowlerObj'] = {balls:0, overs:0, maidens:0, runs:0, wickets:0, econ:'0.00'};
          isAutoComment = true;
        }
        // call an API to delete from server
        this.deleteBallsFromServer(isAutoComment);
      }
    }
  }

  deleteBallsFromServer(isAutoComment?) {
    // create an arr to send to server for delete ball and store in local
    // set back new deleted ball arr
    this.storage.set(this.localStorageKey + 'delete-balls', this.ballToDeleteClientIdArr);
    this.currentStats.showSelectBowler = false;
    // show delete spinner
    this.deletingBallInProgress = true;
    // call save ball API to save ball details
    this.scoringService.deleteBalls(this.matchData.clubId, this.ballToDeleteClientIdArr)
    .subscribe((value: any) => {
      // check response
      if (value.responseState && value.data) {
        console.log('value', value);
        // value.data will be an object having keys of clientId deleted at server
        for (const id in value.data) {
          if (value.data[id]) {
            const msg = value.data[id];
            if (msg == '1 Ball Deleted') {
              // remove object from array match by clientId
              const index = this.currentInningBalls.findIndex((o) => o.clientId == id);
              if (index > -1) this.currentInningBalls.splice(index, 1);
              // remove from local array and update local storage
              const clientIdLocalIndex = this.ballToDeleteClientIdArr.indexOf(Number(id));
              if (clientIdLocalIndex > -1) {
                this.ballToDeleteClientIdArr.splice(clientIdLocalIndex, 1);
              }
            }
          }
        }
        // update deleted balls to local storage
        this.storage.set(this.localStorageKey + 'delete-balls', this.ballToDeleteClientIdArr);
        // store this ball-data in local storage too
        const storeBallsData = {
          clubId: this.matchData.clubId,
          matchId: this.matchData.matchId,
          matchDate: this.matchData.date,
          teamOneId: this.matchData.teamOne,
          teamOneName: this.matchData.teamOneName,
          teamTwoId: this.matchData.teamTwo,
          teamTwoName: this.matchData.teamTwoName,
          balls: this.ballsData
        }
        this.storage.set(this.localStorageKey + 'save-balls', storeBallsData);

        // if (!isAutoComment) {
          // calculateBallsInfo to update stats
          this.calculateBallsInfo();
          // calculate over only when this func not called from select player modal response to set new over
          this.calculateOver();
          // get current over balls
          this.getCurrentOver();
        // }
      } else {
        console.log('Failed to call API');
        if(value.errorMessage){
          this.errorMessage = value.errorMessage;
        }
      }
      // hide delete spinner
      this.deletingBallInProgress = false;
    }, (error) => {
      // hide delete spinner
      this.deletingBallInProgress = false;
      console.log('Api error');
      if(error.name == 'HttpErrorResponse')
        this.ccUtil.fail_modal('Please check your Network Connection');
      else
        this.ccUtil.fail_modal(error.message);
    });
  }

  changeStriker(ballObject) {
    if (ballObject.ballType == 'Wide' || ballObject.ballType == 'Good Wide'){
      if ((ballObject.runs - Number(this.actionsData.runsForWide)) % 2 == 1){
        this.swapPlayers();
      }
    } else if (['No Ball', 'No Ball of Bat', 'Good No Ball', 'No Ball Bye', 'Good No Ball Bye', 'No Ball Leg Bye', 'Good No Ball Leg Bye', 'Good No Ball of Bat'].includes(ballObject.ballType)) {
      if ((ballObject.runs - Number(this.actionsData.runsForNoBall)) % 2 == 1) {
        this.swapPlayers();
      }
    } else {
      if (ballObject.ballType != 'Add Penalties' && ballObject.ballType != 'Remove Penalties') {
        if (ballObject.runs % 2 == 1) {
          this.swapPlayers();
        }
      }
    }
  }

  swapPlayers() {
    const temp = this.currentStats.batsman;
    this.currentStats.batsman = this.currentStats.runner;
    this.currentStats.runner = temp;
    this.currentStats['batsmanName'] = this.liveScoringTeamsData.battingPlayers[this.currentStats.batsman];
    this.currentStats['runnerName'] = this.liveScoringTeamsData.battingPlayers[this.currentStats.runner];

    const temp2 = this.currentStats['batsmanObj'];
    this.currentStats['batsmanObj'] = this.currentStats['runnerObj'];
    this.currentStats['runnerObj'] = temp2;
  }

  getLocalBalls() {
    // get unsaved balls
    this.storage.get(this.localStorageKey + 'save-balls').then(localBalls => {
      let unsavedBalls: any = [];
      if (localBalls) {
        unsavedBalls = this.getUnsavedBalls(localBalls.balls);
        if(unsavedBalls && unsavedBalls.length > 0){
          this.askUserToSaveUnsavedBalls(unsavedBalls);
        }
      }
    });
    // get undeleted balls
    this.storage.get(this.localStorageKey + 'delete-balls').then(undeletedBalls => {
      if (undeletedBalls && undeletedBalls.length > 0) {
        this.ballToDeleteClientIdArr = undeletedBalls;
        // call delete API to delete undeleted balls from server
        this.deleteBallsFromServer();
      }
    });
  }

  async askUserToSaveUnsavedBalls(unsavedBalls) {
    const ballsAlert = await this.alertController.create({
      header: 'Save Local Balls',
      subHeader: 'There are some unsaved balls, Do you want to Save or Discard?',
      backdropDismiss: false,
      buttons: [
       {
          text: 'No',
          role: 'cancel',
          handler:() => {

          }
        },
        {
          text: 'Yes',
          handler:() => {
            unsavedBalls.forEach(ball => {
              // push ball data in current inning
              if (ball.inningsNumber == 1) {
                this.ballsData.inning1Balls.push(ball);
              } else if (ball.inningsNumber == 2) {
                this.ballsData.inning2Balls.push(ball);
              } else if (ball.inningsNumber == 3) {
                this.ballsData.inning3Balls.push(ball);
              } else if (ball.inningsNumber == 4) {
                this.ballsData.inning4Balls.push(ball);
              }
            });
            this.saveBalls();
            this.calculateBallsInfo();
            // get current over balls
            this.getCurrentOver();
            // calculate over only when this func not called from select player modal response to set new over
            this.calculateOver();
          }
        }
      ]
    });
    await ballsAlert.present();
  }

  endScorerSession() {
    this.scoringService.endScoringSession(this.matchData.clubId, this.matchData.matchId)
    .subscribe((value: any) => {
      // check response
      if (value.responseState && value.data && value.data == 'Success') {
        console.log(value.data);
        // reload data of scoring list by calling subscribed method
        this.scoringService.endScorerSessionSubscriber.next();
        // navigate back to scoring list page
        this.router.navigate(['/live-scoring-list']);
      }
    }, (error) => {
      if(error.name == 'HttpErrorResponse')
        this.ccUtil.fail_modal('Please check your Network Connection');
      else
        this.ccUtil.fail_modal(error.message);
    });
  }
}
