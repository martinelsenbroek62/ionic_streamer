import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import { CcutilService } from './services/ccutil.service';
import { Deeplinks } from '@ionic-native/deeplinks/ngx';
import { NgZone } from '@angular/core';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { ChatService } from './chat/services/chat.service';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
// import { AppCenterAnalytics } from '@ionic-native/app-center-analytics/ngx';
// import { AppCenterCrashes } from '@ionic-native/app-center-crashes/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  downloadInProgress: any;
  percentageOnProgress = 0;
  environmentValue: any;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    private deeplinks: Deeplinks,
    private zone: NgZone,
    private oneSignal: OneSignal,
    private chatService: ChatService,
    private androidPermissions: AndroidPermissions,
    public ccUtil: CcutilService
  ) {
    this.initializeApp();

    this.environmentValue = (!localStorage.getItem('environment') || localStorage.getItem('environment') == 'TEST') ? false : true;
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.androidPermissions.requestPermissions([
        this.androidPermissions.PERMISSION.CAMERA,
        this.androidPermissions.PERMISSION.MODIFY_AUDIO_SETTINGS,
      this.androidPermissions.PERMISSION.RECORD_AUDIO
      ]);

      this.setupDeeplinks();
      // this.statusBar.styleLightContent();
      this.statusBar.overlaysWebView(false);
      this.statusBar.backgroundColorByHexString('#dd5727');

      if (!this.platform.is('mobileweb') && !this.platform.is('desktop') && (this.platform.is('ios') || this.platform.is('android'))) {
        
        // check if push token is updated to server by calling API, call an API to set other mobile details as well to server
        // THIS CALL OF addMobileDetails() IS TEMPRARLY FOR EXISTING USERS WHOS PUSH TOKEN COULD NOT SAVED TO DATABASE - TO ADD THEM FROM LOCAL TO DATABASE
        // this.ccApi.addMobileDetails();
      }

      this.oneSignal.startInit('608d1f65-8659-473f-8500-384e6528ed40', '1003131010427');
      this.oneSignal.getIds().then(res => {
        // console.log('OneSignal device Id: ',JSON.stringify(res));
        if(res){
          localStorage.setItem('pushToken', res.userId);

          // check if push token is updated to server by calling API, call an API to set other mobile details as well to server
          // this.ccApi.addMobileDetails();
        }
      });
      this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);

      this.oneSignal.handleNotificationReceived().subscribe(data => {
        // do something when notification is received
        // const msg = data.payload.body;
        // const title = data.payload.title;
        if (data && data.payload) {
          const additionalData = data.payload.additionalData;
          console.log('handleNotificationReceived additionalData', additionalData);
          if (additionalData && additionalData['MATCH_ID'] && additionalData['NOTIFICATION_TYPE']) {
            const matchId = additionalData['MATCH_ID'];
            if (additionalData['NOTIFICATION_TYPE'] === 'PLAYING_XI_LINE_UPS') {
              // redirect to match page
              const internalPath = '/contests/upcoming/match/' + matchId;
              this.router.navigateByUrl(internalPath);
            }
          }
        }
       });

       this.oneSignal.handleNotificationOpened().subscribe(data => {
        // do something when a notification is opened
        // Just a note that the data is a different place here!
        if (data && data.notification && data.notification.payload) {
          const additionalData = data.notification.payload.additionalData;
          console.log('handleNotificationOpened', additionalData);
        }
       });

      this.oneSignal.endInit();
    });

    if (localStorage.getItem('userId')) {
      // update user status to be used in managing when user is last loggedin
      this.chatService.callUpdateUserStatus('login');
      // call a function to create chat sync listener
      // this.chatService.chatSyncOnlineUsers(localStorage.getItem('userId'));
      // redirect to maintabs if already loggedin
      this.router.navigate(['/maintabs']);
    }
  }

  logout() {
    localStorage.removeItem('X-Auth-Token');
    localStorage.removeItem('userId');
    localStorage.removeItem('profileImage');
    localStorage.removeItem('lName');
    localStorage.removeItem('fName');
    localStorage.removeItem('userName');
    // update user status to be used in managing when user is last loggedin
    this.chatService.callUpdateUserStatus('logout');
    // this.router.navigateByUrl('/', { replaceUrl: true });
    window.location.href = '/';
  }

  login(){
    this.router.navigate(['/']);
  }

  changeEnvironment(event) {
    // console.log('changeEnvironment', event.currentTarget.checked);
    // set environment to PRODUCTION in local storage if it is checked else set TEST
    if (event.currentTarget.checked) {
      localStorage.setItem('environment', 'PRODUCTION');
    } else {
      localStorage.setItem('environment', 'TEST');
    }
    // then logout so that new token can be registered on change of environment
    this.logout();
  }

  redirectToPlayerProfile() {
    const userId = localStorage.getItem('userId');
    this.router.navigate(['/user-profile'], {state: { data: userId, isAuthToken: true }});
  }

  pageRedirect(pageName){
    this.router.navigate(['/maintabs/'+pageName], { state: { data: pageName} });
  }

  setupDeeplinks() {
    // APP ROUTE PATH: contests/:status/:matchType/:matchId
    this.deeplinks.route({ '/:status/:matchType/:matchId': 'contests' }).subscribe(
      match => {
        console.log('Successfully matched route', match);

        // Create our internal Router path by hand
        const internalPath = `/${match.$route}/${match.$args['status']}/${match.$args['matchType']}/${match.$args['matchId']}`;

        // Run the navigation in the Angular zone
        this.zone.run(() => {
          this.router.navigateByUrl(internalPath);
        });
      },
      nomatch => {
        // nomatch.$link - the full link data
        console.error("Got a deeplink that didn't match", nomatch);
      }
    );
  }
}
