import { NgModule,CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { BrowserModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { HttpClientModule } from '@angular/common/http';
import { CommonfailComponent } from './modals/commonfail/commonfail.component';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { DatePicker } from '@ionic-native/date-picker/ngx';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { Camera } from '@ionic-native/camera/ngx';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { CcutilService } from './services/ccutil.service';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { Toast } from '@ionic-native/toast/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Crop } from '@ionic-native/crop/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { Device } from '@ionic-native/device/ngx';
import { CountdownModule, CountdownGlobalConfig } from 'ngx-countdown';
import { OrderModule } from 'ngx-order-pipe';
import { NgOtpInputModule } from 'ng-otp-input';
import { CodePush } from '@ionic-native/code-push/ngx';
import { Deeplinks } from '@ionic-native/deeplinks/ngx';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { Base64 } from '@ionic-native/base64/ngx';
import { IOSFilePicker } from '@ionic-native/file-picker/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { AdMobFree } from '@ionic-native/admob-free/ngx';
import { AdmobService } from './services/admob.service';
import { environment } from 'src/environments/environment';
import { IonicStorageModule } from '@ionic/storage';

// firebase imports
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireModule } from '@angular/fire';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
@NgModule({
  declarations: [AppComponent, CommonfailComponent],
  entryComponents: [CommonfailComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    FormsModule,HttpClientModule, ReactiveFormsModule, CountdownModule, OrderModule, NgOtpInputModule, IonicStorageModule.forRoot()
    // ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production })
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  providers: [
    StatusBar,
    SplashScreen,
    DatePicker,
    Camera,
    FileTransfer,
    File,
    CcutilService,
    Clipboard,
    Toast,
    SocialSharing,
    FormsModule,
    ReactiveFormsModule,
    CountdownGlobalConfig,
    Crop,
    Device,
    FilePath,
    CodePush,
    FileChooser,
    Base64,
    IOSFilePicker,
    InAppBrowser,
    Deeplinks,
    OneSignal,
    AdMobFree,
    AdmobService,
    ScreenOrientation,
    AndroidPermissions,
    // AppCenterAnalytics,
    // AppCenterCrashes,
    FileOpener,
    Geolocation,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
