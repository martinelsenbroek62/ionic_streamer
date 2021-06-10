// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  fcmAPIConfig: {
    URL: 'https://fcm.googleapis.com/fcm/send',
    // Authorization: 'key=AAAA7VsP8w8:APA91bG-c6_AKK6KrZpcfYRGcIpfcEyX3oZCmIkuSt8mFFHxZ4b5ZfYmgBdfH6bc5SRr6rxkJ47GFCno4K3EHhGljUl3Lgep0o_8obpLFVuGIqXBajzCOw6zfoINP9EBbuFeTpsr7Y4d'.
    Authorization: 'key=AAAALrIA0rM:APA91bHNcUZKsu9Ia9g0hzr9qamL8ZhCh_YeLW47Ykj8uG4jMKR3mbWLmebfXeuB8Y57hhp--NdPhFktQLQLMZdhwrZcDtNKvmrl1zMY3ApVaoKxcUFhVdj1i8rj37kU0ll5VQiJJtRu'
  },
  firebaseConfig: {
    apiKey: "AIzaSyC4PIqfbmiHjwDk_lLqNNZP0FMx2deY2hA",
    authDomain: "cricclubstestapp.firebaseapp.com",
    databaseURL: "https://cricclubstestapp.firebaseio.com",
    projectId: "cricclubstestapp",
    storageBucket: "cricclubstestapp.appspot.com",
    messagingSenderId: "1003131010427",
    appId: "1:1003131010427:web:c0c0662c4c7bf5f8ebd1de"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
