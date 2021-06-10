# PWA STEPS

Install service worker, Build prod

```
npm install @angular/service-worker
ionic build --prod
```

install http-server (if not), and run

```
npm install -g http-server
http-server ./www -p 8888
```

Initial firebase setup

```
npm install -g firebase-tools
firebase login
firebase init
firebase target:apply hosting app cc-fantasy
firebase deploy
```

For deploying updates to web app

```
ionic build --prod
firebase deploy
```

DEEPLINK INSTALLATION STEPS, install this

```
npm install @ionic-native/deeplinks
cordova plugin add ionic-plugin-deeplinks --variable URL_SCHEME=ccfantasy --variable DEEPLINK_SCHEME=https --variable DEEPLINK_HOST=ccfantasy.com
```

# IOS AD-MOB ISSUE FIXED

1. For Google Ad in iOS
2. Added these lines in GoogleService-Info.plist
3. Ad-mob-free plugin issue

In your project remove /plugins/cordova-admob-sdk/src/ios/GoogleMobileAds.framework. Extract file .zip downloaded and copy GoogleMobileAds.framework to /plugins/cordova-admob-sdk/src/ios/. Remove ios platform and add again:

```
ionic cordova platform rm ios
ionic cordova platform add ios
```

# Using ng2-search-filter for filtering user or any data list in template

`npm i ng2-search-filter`

These permissions are required to add in AndroidManifest.xml

```
<uses-feature android:name="android.hardware.camera" />
<uses-feature android:name="android.hardware.camera.autofocus" />
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-feature android:name="android.hardware.camera" />
<uses-feature android:name="android.hardware.camera.autofocus" />
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.RECORD_VIDEO" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
```

Video needs to stop after FacingMode changed (setFacingMode). Removed download option from video tag - donot allow ro download

```
<network-security-config>
    <domain-config cleartextTrafficPermitted="true">
        <domain includeSubdomains="true">localhost</domain>
        <domain includeSubdomains="true">appspot.com</domain>
    </domain-config>
</network-security-config>
```
