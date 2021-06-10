import { Injectable } from '@angular/core';
import { LoadingController, ToastController, ModalController, Platform, AlertController } from '@ionic/angular';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { CommonfailComponent } from '../modals/commonfail/commonfail.component';
import { CONSTANTS } from 'src/app/constants/constants';
// import { Network } from '@ionic-native/network/ngx';

@Injectable({
  providedIn: 'root'
})
export class CcutilService {
  private loadingSpinner: any;
  public matchDetailsObject: any;
  public webWiew: any = window;
  public RESOURCE_URL: string;
  public ballsPerOver = 6;
  public userFullName: string;
  public userProfilePic: string;
  public userToken: string;
  public clubStructureEnabled = true;
  public isNetworkConnected = true;
  public canAddPlayers = true;

  // temporary storage for series and team filters
  seriesFilterList: any;
  teamFilterList: any;

  constructor(public platform: Platform, private loadingController: LoadingController, private toastctrl:ToastController, private alertController:AlertController, 
    // private network: Network, 
    private socialShare:SocialSharing, private modalctrl: ModalController) {

    this.userFullName = localStorage.getItem('fName') + ' ' + localStorage.getItem('lName');
    this.userProfilePic = localStorage.getItem('profileImage');
    this.userToken = localStorage.getItem('X-Auth-Token');
    this.RESOURCE_URL = CONSTANTS.RESOURCE_URL;
  }

  getAuthToken() {
    return localStorage.getItem('X-Auth-Token');
  }

  // setNetworkOnline() {
  //   // watch network for a disconnection
  //   let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
  //     console.log('network was disconnected :-(');
  //   });

  //   // stop disconnect watch
  //   disconnectSubscription.unsubscribe();


  //   // watch network for a connection
  //   let connectSubscription = this.network.onConnect().subscribe(() => {
  //     console.log('network connected!');
  //     // We just got a connection but we need to wait briefly
  //     // before we determine the connection type. Might need to wait.
  //     // prior to doing any api requests as well.
  //     setTimeout(() => {
  //       if (this.network.type === 'wifi') {
  //         console.log('we got a wifi connection, woohoo!');
  //       }
  //     }, 3000);
  //   });
  // }

  getObjectKeys(object) {
    if (object) {
      return Object.keys(object);
    } else {
      return [];
    }
  }

  objectToArray(object): Array<any> {
    if (object) {
      return Object.values(object);
    } else {
      return [];
    }
  }

  toNumber(str) {
    // num to string
    return Number(str);
  }

  getNumbersArray(num) {
    return Array(num).fill(0).map((x,i)=>(i+1));
  }

  setAnalyticsEvents(pageName){
    if (!this.platform.is('mobileweb') && !this.platform.is('desktop') && (this.platform.is('ios') || this.platform.is('android')))
      this.webWiew.AppCenter.Analytics.trackEvent(pageName);
  }

  getMatchType(keyword): string {
    let retVal;
    if (keyword == "f") retVal = "Final";
    else if (keyword == "s") retVal = "Semi Final";
    else if (keyword == "q") retVal = "Quarter Final";
    else if (keyword == "e") retVal = "Eliminator";
    else if (keyword == "l") retVal = "League";
    else if (keyword == "p") retVal = "Practice";
    else if (keyword == "ql") retVal = "Qualifier";
    else if (keyword == "sl") retVal = "Super League";
    else if (keyword == "3p") retVal = "3rd Position";

    return retVal;
  }

  getSeriesType(keyword): string {
    let retVal;
    if (keyword == "Twenty20") retVal = "Twenty20 (16-25 overs)";
    else if (keyword == "One Day") retVal = "One Day (26-50 overs)";
    else if (keyword == "Ten10") retVal = "Ten10 (2-15 overs)";
    else if (keyword == "Test") retVal = "Test";
    else if (keyword == "Youth") retVal = "Youth";
    else if (keyword == "Women") retVal = "Women";
    else if (keyword == "2X") retVal = "2X Innings (Beta)";
    else if (keyword == "100b") retVal = "100 Ball (Beta)";

    return retVal;
  }

  trimString(string, strLength): any {
    let value: any;
    if (string != undefined) {
      if (string.length > strLength) value = string.substring(0, strLength);
      else value = string;
    }
    return value;
  }

  formulaOver(balls): any {
    if (!balls || balls == 0) {
      return "0.0";
    }

    let retVal = "";
    retVal += Math.floor(balls / this.ballsPerOver);
    retVal += "." + (balls % this.ballsPerOver);

    return retVal;
  }

  formulaOverToBalls(overs): any {
    if (!overs) {
      return 0;
    }
    overs = overs + "";

    let retVal;
    let temp = overs.split(".");
    retVal = (parseInt(temp[0]) ? parseInt(temp[0]) : 0) * this.ballsPerOver;
    if (temp.length > 1) retVal += parseInt(temp[1]) ? parseInt(temp[1]) : 0;

    return retVal;
  }

  async showLoading(duration=700) {
    const loading = await this.loadingController.create({
      cssClass: 'loader-custom-class',
      message: 'Please wait...',
      duration
    });
    await loading.present();

    await loading.onDidDismiss();
    console.log('Loading dismissed!');
  }

  async showError(title, message) {
    const errorAlert = await this.alertController.create({
      header: title ? title : 'Error',
      message: message ? message : 'Oops Something went wrong!!!',
      backdropDismiss: false,
      buttons: [
        {
          text: 'Ok',
          role: 'cancel',
          handler: () => {},
        },
      ],
    });
    errorAlert.present();
  }

  public share(URL, text = '') {
    // alert(this.invitation);
    text = text + '\n\nTo Download CC Fantasy Mobile App please visit https://ccfantasy.com';
    this.socialShare.share(text, null, null, URL).then(success => {
      // console.log('shared successfullu')
    }, err => {
      // console.log('share error')
    });
  }

  async showLoader() {
    if (this.loadingSpinner) {
      this.loadingSpinner.dismiss();
    }
    if (!this.loadingSpinner) {
      this.loadingSpinner = await this.loadingController.create({
        cssClass: 'loader-custom-class',
        message: 'Please wait...',
      });
      this.loadingSpinner.present();

      this.loadingSpinner.onDidDismiss(()=>{
        this.loadingSpinner = null;
      });
    }
  }

  async hideLoader() {
    if (this.loadingSpinner) {
      await this.loadingSpinner.dismiss()
      .then(() => {
        this.loadingSpinner = null;
      })
      .catch(e => console.log(e));
    }
  }

  async presentToast(message: any, color: any = 'dark', position: any = 'bottom', duration=2000) {
    const toast = await this.toastctrl.create({
      message: message,
      duration: duration,
      position: position,
      color: color      
    });
    toast.present();
  }

  async fail_modal(msg) {
    const modal = await this.modalctrl.create({
      component: CommonfailComponent,
      cssClass: 'modal-transparency',
      componentProps: { 'message': msg }
    });
    modal.onDidDismiss().then((res)=> {
      //
    });
    return await modal.present();
  }

  async messageAlert(header, message) {
    const alert = await this.alertController.create({
      // cssClass: 'my-custom-class',
      header,
      subHeader: message,
      buttons: ['OK']
    });

    await alert.present();
  }

  async loginAlert() {
    const alert = await this.alertController.create({
      // cssClass: 'my-custom-class',
      header: 'Login Required',
      subHeader: 'Please login to continue',
      buttons: ['OK']
    });

    await alert.present();
  }

  async success_modal(msg, hideCheck = false, callback = null) {
    // const modal = await this.modalctrl.create({
    //   component: CommonupdateComponent,
    //   cssClass: 'modal-transparency',
    //   componentProps: { 'message': msg, hideCheck }
    // });
    // modal.onDidDismiss().then((res)=> {
    //   //
    //   if (callback) {
    //     callback();
    //   }
    // });
    // return await modal.present();
  }

  async showNetworkStatus() {
    let message = '';

    if (this.isNetworkConnected) message = 'You are online';
    else message = 'You are offline';

    const networkStatusAlert = await this.alertController.create({
      header: 'Network Status',
      subHeader: message,
      backdropDismiss: false,
      buttons: [
        {
          text: 'Ok',
          role: 'cancel',
          handler: () => {},
        },
      ],
    });
    await networkStatusAlert.present();
  }

  getRunsText(ball): String {
    if (ball.outMethod) {
      if (ball.runs != 0) {
        if (ball.ballType == "Wide" || ball.ballType == "Good Wide") {
          return "W," + "wd" + ball.runs;
        } else {
          return "W," + ball.runs;
        }
      } else {
        return "W";
      }
    } else if (ball.ballType != "Good Ball") {
      var extraBall = "";
      var extraRuns = 0;
      if (ball.ballType == "No Ball") {
        extraBall = "nb";
        extraRuns = parseInt(ball.runs) - 1;
      } else if (ball.ballType == "Good No Ball") {
        extraBall = "nb";
        extraRuns = parseInt(ball.runs) - 1;
      } else if (ball.ballType == "No Ball of Bat") {
        extraBall = "rn";
        extraRuns = parseInt(ball.runs) - 1;
      } else if (ball.ballType == "Good No Ball of Bat") {
        extraBall = "rn";
        extraRuns = parseInt(ball.runs) - 1;
      } else if (ball.ballType == "No Ball Bye") {
        extraBall = "nb b";
        extraRuns = parseInt(ball.runs) - 1;
      } else if (ball.ballType == "Good No Ball Bye") {
        extraBall = "rn";
        extraRuns = parseInt(ball.runs) - 1;
      } else if (ball.ballType == "No Ball Leg Bye") {
        extraBall = "nb lb";
        extraRuns = parseInt(ball.runs) - 1;
      } else if (ball.ballType == "Good No Ball Leg Bye") {
        extraBall = "rn";
        extraRuns = parseInt(ball.runs) - 1;
      } else if (ball.ballType == "Wide") {
        extraBall = "wd";
        extraRuns = parseInt(ball.runs) - 1;
      } else if (ball.ballType == "Good Wide") {
        extraBall = "wd";
        extraRuns = parseInt(ball.runs) - 1;
      } else if (ball.ballType == "Bye") {
        extraBall = "b";
        extraRuns = parseInt(ball.runs);
      } else if (ball.ballType == "Leg Bye") {
        extraBall = "lb";
        extraRuns = parseInt(ball.runs);
      } else if (ball.ballType == "Add Penalties") {
        extraBall = "+p";
        extraRuns = parseInt(ball.runs);
      } else if (ball.ballType == "Remove Penalties") {
        extraBall = "-p";
        extraRuns = parseInt(ball.runs);
      } else if (ball.ballType == "No Count Ball") {
        extraBall = "C";
        extraRuns = parseInt(ball.runs) - 1;
      }
      if (extraRuns > 0) {
        return extraBall + extraRuns;
      } else {
        return extraBall;
      }
    } else {
      return ball.runs;
    }
  }

  formulaAve(runsScored, innings, notOuts): string {
    if (runsScored == 0) {
      return "0.00";
    } else if ((innings - notOuts) == 0) {
      return "--.--";
    } else {
      let value: any;
      value = (runsScored / (innings - notOuts));
      value = value.toFixed(1);
      return value;
    }
  }

  formulaBowlingAve(runsScored, wickets): any {
    if (runsScored == 0) {
      return "0.00";
    } else if (wickets == 0){
      return "--.--";
    }
    let value: any;
    value = runsScored / wickets;
    value = value.toFixed(1);
    return value;
  }

  formulaEcon(runs, balls): any {
    if (runs == 0 || balls == 0) {
      return "0.00";
    }
    let value: any;
    value = (runs * this.ballsPerOver) / balls;
    value = value.toFixed(1);
    return value;
  }

  formulaSR(runsScored, ballsFaced): any {
    let value: any;
    if (runsScored == 0) {
      return "0.00";
    } else {
      value = (runsScored / ballsFaced) * 100;
      value = value.toFixed(1);
      return value;
    }
  }
}
