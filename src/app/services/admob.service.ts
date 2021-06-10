import { Injectable } from '@angular/core';
// IMPORT PLATFORM SO WE CAN START ADMOB AS SOON AS IT'S READY.
import { Platform } from '@ionic/angular';
// IMPORT WHAT WE NEED FROM ADMOBFREE PLUGIN.
import { AdMobFree, AdMobFreeBannerConfig, AdMobFreeInterstitialConfig, AdMobFreeRewardVideoConfig } from '@ionic-native/admob-free/ngx';
import { CONSTANTS } from '../constants/constants';

@Injectable({
  providedIn: 'root'
})
export class AdmobService {

  sourcePage: any;

  // BANNER CONFIG
  bannerConfig: AdMobFreeBannerConfig = {
    isTesting: false, // KEEP DURING CODING, REMOVE AT PROD.
    autoShow: true
  };

  // INTERSTITIAL CONFIG
  interstitialConfig: AdMobFreeInterstitialConfig = {
    isTesting: false, // KEEP DURING CODING, REMOVE AT PROD.
    autoShow: false
  };

  // REWARD VIDEO CONFIG.
  rewardVideoConfig: AdMobFreeRewardVideoConfig = {
    isTesting: false, // KEEP DURING CODING, REMOVE AT PROD.
    autoShow: false
  };

  constructor(public platform: Platform, private admobFree: AdMobFree) {

    if (!this.platform.is('mobileweb') && !this.platform.is('desktop')) {
      if (this.platform.is('android')) {
        // CONFIG ID FOR ANDROID
        this.bannerConfig.id = CONSTANTS.ADMOB_APP_ID.ANDROID;
        this.interstitialConfig.id = CONSTANTS.ADMOB_APP_ID.ANDROID;
        this.rewardVideoConfig.id = CONSTANTS.ADMOB_APP_ID.ANDROID;
      } else if (this.platform.is('ios')) {
        // CONFIG ID FOR IOS
        this.bannerConfig.id = CONSTANTS.ADMOB_APP_ID.IOS;
        this.interstitialConfig.id = CONSTANTS.ADMOB_APP_ID.IOS;
        this.rewardVideoConfig.id = CONSTANTS.ADMOB_APP_ID.IOS;
      }
    }
  }

}
