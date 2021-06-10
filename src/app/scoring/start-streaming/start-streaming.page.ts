import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { VideoStreamService } from '../services/video-stream.service';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { AlertController, NavController, Platform } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { CcutilService } from 'src/app/services/ccutil.service';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

declare var MediaRecorder: any;

@Component({
  selector: 'app-start-streaming',
  templateUrl: './start-streaming.page.html',
  styleUrls: ['./start-streaming.page.scss'],
})
export class StartStreamingPage implements OnInit, AfterViewInit, OnDestroy {

  preview;
  // recording;
  // startButton;
  // stopButton;
  downloadButton;
  logElement;

  c1;
  // c1Ctx;
  overlayImg;

  recordingTimeMS = 5000;

  // set default environment mode for camera
  facingMode = 'environment';

  started = false;
  streamBegin = false;
  startSendingStreamingNow = false;

  liveScore: any;
  mediaRecorder: any;

  authResponse: any;
  streamResponse: any;
  broadcastInsertResponse: any;
  timerVar: any;

  webSocketInstance: any;

  showServerLogMessages = false;
  streamEnds = false;

  // youtubeKey = 'g3m8-6hdw-qfsm-v45r-chwd';
  // matchId = '609';
  // clubId = '50';

  // MY TESET ACCOUNT
  // CLIENT_ID = '474903177104-8nahblqsqs68h7v1a4mjefnn572ou5p5.apps.googleusercontent.com';
  // CLIENT_SECRET = 'MTQ3vsH7SHDTy0E-t2zIdUcE';
  // API_KEY = 'AIzaSyDfYdRd_PvRbhrhbtlUTsijIRGOXZWLzQg';

  // CRICCLUBS ACCOUNT
  CLIENT_ID = '1019435021071-e6lbbmunr8hifmhi4vpqhsj32kk0u9hi.apps.googleusercontent.com';
  CLIENT_SECRET = 'YK5uq5TBIfLFbeOMh28OB35E';
  API_KEY = 'AIzaSyAI9Z6xHxBkZ5Y0btB846sZ30V-wJZXRDk';

  liveStreamDetails: any;
  matchDetails: any;
  loadingSpinner: any;

  constructor(private platform: Platform, private videoStreamService: VideoStreamService, private screenOrientation: ScreenOrientation, private route: ActivatedRoute, private router: Router, public ccUtil: CcutilService, private navCtrl: NavController, private iab: InAppBrowser, public alertController: AlertController) {
    this.recordingTimeMS = 5000;

    // gapi.load("client:auth2", () => {
    //   gapi.auth2.init({client_id: this.CLIENT_ID});
    // });

    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.matchDetails = this.router.getCurrentNavigation().extras.state.match;
        if (this.matchDetails.streamKey && this.matchDetails.fixtureId && this.matchDetails.youtubePublicUrl) {
          // stream already started
          if (!this.liveStreamDetails) {
            this.liveStreamDetails = {};
          }
          // use details from my stream
          this.liveStreamDetails = this.matchDetails;
        }

        this.loadingSpinner = false;
      }
    });

    const backButtonHPEvent = this.platform.backButton.subscribeWithPriority(10, (processNextHandler) => {
      console.log('Back press handler!');
      // unsubscribe backButtonEvent
      backButtonHPEvent.unsubscribe();
      processNextHandler();
    });

    // subscribe hardware native back button
    const backButtonEvent = this.platform.backButton.subscribeWithPriority(5, () => {
      console.log('Back button handler called!');
      // confirm before stopping stream - if stream starts - else navigate back
      if (this.webSocketInstance) {
        this.stopStreamingIfConfirm();
      } else {
        // stream NOT starts YET - navigate back
        if (!this.platform.is('mobileweb') && !this.platform.is('desktop') && (this.platform.is('ios') || this.platform.is('android'))) {
          // set to PORTRAIT
          this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
        }
        // navigate back
        this.navigateBack();
      }
      // unsubscribe backButtonEvent
      backButtonEvent.unsubscribe();
    });
  }

  navigateBack() {
    this.navCtrl.back();
  }

  refresh() {
    window['location'].reload();
  }

  ngOnInit() {
    // this.getLiveScore();

    // this.sendLiveStreamToYoutube();

    // directly start stream - WITHOUT ASKING CAMERA ENVIRONMENT
    this.streamBeginFunc();
  }

  ngOnDestroy() {
    this.removeEventListener();
  }

  ngAfterViewInit() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      this.preview = document.getElementById('preview');
      // mute video
      this.preview.muted = true
      // this.recording = document.getElementById('recording');
      // this.startButton = document.getElementById('startButton');
      // this.stopButton = document.getElementById('stopButton');
      // this.downloadButton = document.getElementById('downloadButton');
      this.logElement = document.getElementById('log');

      // this.c1 = document.getElementById('c1');
      // Get canvas contexts
      // this.c1Ctx = this.c1.getContext('2d');

      this.overlayImg = new Image();
      this.overlayImg.src = '../assets/images/ccicon.png';

      this.setCameraConfig();
    }
  }

  async stopStreamingIfConfirm() {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'Stop Streaming?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Okay',
          handler: () => {
            console.log('Confirm Okay');
            // stop streaming
            this.stopStreaming();
            // navigate back
            this.navigateBack();
          }
        }
      ]
    });

    await alert.present();
  }

  getLiveStreamDetails() {
    if (this.liveStreamDetails && this.liveStreamDetails.streamKey && this.liveStreamDetails.fixtureId && this.liveStreamDetails.youtubePublicUrl) {
      // do nothing we already have match details
      // start streaming now
      this.startStreaming();
    } else {
      // call an API
      this.videoStreamService.getLiveStreamDetails(this.matchDetails)
      .subscribe((value: any) => {
        this.loadingSpinner = false;
        // check response
        if (value.responseState && value.data) {
          if (!this.liveStreamDetails) {
            this.liveStreamDetails = {};
          }
          // get live stream details
          this.liveStreamDetails = value.data;

          if (!this.liveStreamDetails.streamKey && this.liveStreamDetails.key) {
            this.liveStreamDetails.streamKey = this.liveStreamDetails.key;
          }

          // start streaming now
          this.startStreaming();
        } else {
          this.loadingSpinner = false;
          console.log('Failed to call API');
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
  }

  /*
  getLiveScore() {
    // clubId=16&matchId=1871
    this.videoStreamService.getLiveScores(16, 1871)
    .subscribe((value: any) => {
      if (value.responseState && value.data) {
        // responseState `true` means we will have data
        this.liveScore = value.data;
      } else {
        // no response
      }
    }, (error) => {
      console.log('error', error);
    });
  }
  */

  removeEventListener() {
    // if (this.startButton) {
    //   this.startButton.removeEventListener('click', () => {}, true);
    // }
    // if (this.stopButton) {
    //   this.stopButton.removeEventListener('click', () => {}, true);
    // }
    if (this.preview) {
      this.preview.removeEventListener('loadedmetadata', () => {});
      this.preview.removeEventListener('play', () => {});
    }
  }

  streamBeginFunc() {
    if (!this.platform.is('mobileweb') && !this.platform.is('desktop') && (this.platform.is('ios') || this.platform.is('android'))) {
      // set to landscape
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);
    }

    this.setCameraConfig();
    this.streamBegin = true;
  }

  // If you have any doubt using async await let me know but its pretty simple.Its an alternative for using
  // then(), catch(), finalize()....
  async setCameraConfig() {
    try {
      // this.startButton.addEventListener('click', () => {
      //   this.startStreaming();
      // });

      // this.stopButton.addEventListener('click', () => {
      //   this.started = false;
      //   this.streamBegin = false;
      //   if (this.mediaRecorder.state === 'recording') {
      //     this.mediaRecorder.stop();
      //   }
      //   this.stop(this.preview.srcObject);
      // }, false);

      // set canvas size = video size when known
      if (this.preview) {
        this.preview.addEventListener('loadedmetadata', () => {
          // 1st canvas
          // this.c1Ctx.width = this.preview.videoWidth;
          // this.c1Ctx.height = this.preview.videoHeight;

          // set width and height
          const scale = 300 / this.preview.videoWidth;

          const w = this.preview.videoWidth * scale;
          const h = this.preview.videoHeight * scale;

          // const w = this.preview.videoWidth;
          // const h = this.preview.videoHeight;

          // this.c1.width = w;
          // this.c1.height = h;
        });

        this.preview.addEventListener('play', (play) => {
        // Run Functions Every Frame
        // Once the user’s video device is ready and ‘playing’, run the functions every frame:
        // setInterval(this.addText(), 0);
        // setInterval(this.addImage(), 0);

        const $this = this; // cache
        (function loop() {
          if (!play.paused && !play.ended) {
            $this.addText();
            // this.addImage();
            setTimeout(loop, 1000 / 30); // drawing at 30fps
          }
        })();
      });
      }
    } catch (e) {
      console.log(e);
    }
  }

  stopStreaming(navigateBack?) {
    if (!this.platform.is('mobileweb') && !this.platform.is('desktop') && (this.platform.is('ios') || this.platform.is('android'))) {
      // set to PORTRAIT
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
    }
    // stop count up counter
    if (this.timerVar) {
      clearInterval(this.timerVar);
    }

    // started set to false
    this.started = false;
    this.startSendingStreamingNow = false;
    this.streamBegin = false;
    if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
      this.mediaRecorder.stop();
    }
    this.stop(this.preview.srcObject);

    // set streamEnds
    this.streamEnds = true;

    // navigating back to previous page on stream stopped
    if (navigateBack) {
      this.navCtrl.back();
    }
  }



  // open camera and get user media
  async getUserMedia() {
    // navigator.mediaDevices
    // .getUserMedia({
    //   audio: true,
    //   video: true
    // })
    // .then(mediaStream => {
    //   console.log('Video camera platform ready');
    //   console.log('mediaStream', mediaStream);
    // });
    let videoConfig = {};
    let audioConfig = {};
    if (!this.platform.is('mobileweb') && !this.platform.is('desktop') && (this.platform.is('ios') || this.platform.is('android'))) {
      videoConfig = {
        width: {exact: 1280}, height: {exact: 720},
        facingMode: {exact: this.facingMode},
        zoom: true
      };
      audioConfig = {
        // sampleSize: 16,
        // channelCount: 2,
        echoCancellation: {exact: true}
      }
    } else {
      videoConfig = true;
      // audioConfig = false;
      audioConfig = {
        // sampleSize: 16,
        // channelCount: 2,
        echoCancellation: {exact: true}
      }
    }

    // get user media from device
    navigator.mediaDevices.getUserMedia({
      // video: {width: {exact: 1920}, height: {exact: 1080}},
      // video: {
      //   // width: { min: 320, ideal: 1920 },
      //   // height: { min: 240, ideal: 1080 },
      //   // frameRate: 30,
      //   // aspectRatio: { ideal: 1.7777777778 },

      //   // width: { min: 270, max: 270 },
      //   // height: { min: 480, max: 480},
      //   facingMode: {exact: this.facingMode}
      // },
      video: videoConfig,
      audio: audioConfig
    }).then(stream => {
      console.log('Video camera platform ready');
      console.log('mediaStream', stream);

      // check if camera supports zoom
      const supports: any = navigator.mediaDevices.getSupportedConstraints();
      if (supports && supports.zoom) {
        // Browser supports camera zoom.
        console.log('Browser supports camera zoom.');

        const navigatorPermissions: any = navigator.permissions;
        const panTiltZoomPermissionStatus: any = navigatorPermissions.query({
          name: 'camera',
          panTiltZoom: true
        });

        panTiltZoomPermissionStatus.then(() => {
          if (panTiltZoomPermissionStatus.state === 'granted') {
            // User has granted access to the website to control camera PTZ.

            // Get video track capabilities and settings.
            const [videoTrack] = stream.getVideoTracks();
            const capabilities: any = videoTrack.getCapabilities();
            const settings: any = videoTrack.getSettings();

            console.log('Check zoom in settings');
            // Let the user control the camera zoom if the camera supports it
            // and PTZ access is granted.
            // if ('zoom' in settings) {
              console.log('zoom in settings');
              const input: any = document.querySelector('input[type=range]');
              // input.min = capabilities.pan.min;
              // input.max = capabilities.pan.max;
              // input.step = capabilities.pan.step;
              // input.value = settings.pan;

              input.addEventListener('input', async () => {
                const constraints: any = [{ zoom: input.value }];
                await videoTrack.applyConstraints({ advanced: constraints });
              });
            // }
          }

          panTiltZoomPermissionStatus.addEventListener('change', () => {
            // User has changed PTZ permission status.
          });
        });
      }

      // stream preview code
      // Older browsers may not have srcObject
      if ('srcObject' in this.preview) {
        try {
          this.preview.srcObject = stream;
        } catch (err) {
          if (err.name != 'TypeError') {
            throw err;
          }
          // Even if they do, they may only support MediaStream
          this.preview.src = URL.createObjectURL(stream);
        }
      } else {
        this.preview.src = URL.createObjectURL(stream);
      }

      // this.downloadButton.href = stream;
      return new Promise(resolve => this.preview.onplaying = resolve);
    })
    .then(() => this.startRecording(this.preview.srcObject, this.recordingTimeMS))
    .then (recordedChunks => {
      // const recordedBlob = new Blob(recordedChunks, { type: 'video/mp4' });
      // this.recording.src = URL.createObjectURL(recordedBlob);

      // CALL NODE SERVER TO SEND STREAM
    })
    .catch(this.log);
  }

  async startStreaming() {
    this.started = true;
    this.webSocketInstance = new WebSocket(
      // 'ws://canvas-streaming.uc.r.appspot.com'
      // 'ws://localhost:3000'
      'ws://ec2-54-196-81-215.compute-1.amazonaws.com:3000'
    );

    // const queryConstraints:any = {
    //   name: 'camera',
    //   panTiltZoom: true
    // };
    // const panTiltZoomPermissionStatus = await navigator.permissions.query(queryConstraints);

    // if (panTiltZoomPermissionStatus.state == 'granted') {
    //   console.log('panTiltZoomPermissionStatus', panTiltZoomPermissionStatus);
    // }

    // message received - show the message in div#messages
    this.webSocketInstance.onmessage = function(event) {
      const message = event.data;

      const messageElem = document.createElement('div');
      messageElem.textContent = message;
      const logElem = document.getElementById('server-log-messages');
      // add message
      logElem.prepend(messageElem);
      // add line
      logElem.prepend(document.createElement('br'));
    }

    this.webSocketInstance.addEventListener('open', (e) => {
      // send data to initialize youtube - youtube_key, match_id and club_id
      this.webSocketInstance.send(JSON.stringify({
        // youtube_key: this.youtubeKey,
        // match_id: this.matchId,
        // club_id: this.clubId,
        // youtube_key: 'fw0h-fx2d-dsue-9s4p-32mu',
        // fixture_id: 1326,
        // club_id: 16
        // youtube_key: this.liveStreamDetails.streamKey,
        // fixture_id: 1326,
        // club_id: 50,
        youtube_key: this.liveStreamDetails.streamKey,
        fixture_id: this.liveStreamDetails.fixtureId,
        club_id: this.liveStreamDetails.clubId
      }));
      console.log('*********** WebSocket Open *********** ', e);
    }, false);

    // open camera and get user media - to show video recording
    this.getUserMedia();
  }

  // switchCamera($event) {
  //   // Switch camera
  //   this.facingMode = $event.target.value;
  //   // if (this.facingMode === 'environment') {
  //   //   this.facingMode = 'user';
  //   // } else {
  //   //   this.facingMode = 'environment';
  //   // }
  // }

  addText() {
    // add text overlay
    // User Video
    // this.c1Ctx.drawImage(this.preview, 0, 0, 320, 240);
    // // Rectangle
    // this.c1Ctx.beginPath();
    // this.c1Ctx.fillStyle = '#f47b21';
    // this.c1Ctx.rect(0, 190, 255, 40); // x, y of top-left, width, height
    // this.c1Ctx.fill();
    // // Text
    // this.c1Ctx.font = '20px Monospace';
    // this.c1Ctx.fillStyle = 'white';
    // this.c1Ctx.fillText('CricClubs Live', 10, 215); // x, y of top-left

    // add image overlay
    // this.addImage();
  }

  // addImage() {
    // Overlay Image
    // this.c1Ctx.drawImage(this.overlayImg, 10, 10, this.overlayImg.width, this.overlayImg.height);
    // x, y of top-left, width, height
  // }

  log(msg) {
    // this.logElement.innerHTML += msg + '\n';
  }

  wait(delayInMS) {
    return new Promise(resolve => setTimeout(resolve, delayInMS));
  }

  startRecording(stream, lengthInMS) {

    this.mediaRecorder = new MediaRecorder(stream
    // , {
    //   mimeType: 'video/webm;codecs=h264',
    //   videoBitsPerSecond : 3000000
    // }
    );
    // const data = [];

    this.mediaRecorder.ondataavailable = event => {
      // data.push(event.data);
      if (this.startSendingStreamingNow && this.webSocketInstance) {
        if (this.webSocketInstance.readyState === 0) {
          // 0	CONNECTING	Socket has been created. The connection is not yet open.
          this.ccUtil.presentToast('Connecting...');
        } else if (this.webSocketInstance.readyState === 1) {
          // 1	OPEN	The connection is open and ready to communicate.
          // start timer counter to show count up in video recording screen
          if (!this.timerVar) {
            this.startTimeCounter();
          }
          console.log('*********** SENDING DATA ***********');
          this.webSocketInstance.send(event.data);
        } else if (this.webSocketInstance.readyState === 2) {
          // 2	CLOSING	The connection is in the process of closing.
          this.ccUtil.presentToast('Closing...');
        } else if (this.webSocketInstance.readyState === 3) {
          // 3	CLOSED	The connection is closed or couldn't be opened.
          this.ccUtil.presentToast('Connection closed!');
          // stop streaming
          this.stopStreaming();
        }
      }
    };

    if (this.webSocketInstance) {
      this.mediaRecorder.addEventListener('stop', this.webSocketInstance.close.bind(this.webSocketInstance));
    }

    // this.stopButton.addEventListener('click', () => {
    //   this.started = false;
    //   this.streamBegin = false;
    //   if (this.mediaRecorder.state === 'recording') {
    //     this.mediaRecorder.stop();
    //   }
    //   this.stop(this.preview.srcObject);
    //   ws.close.bind(ws);
    // }, true);

    this.mediaRecorder.start(1000);

    this.log(this.mediaRecorder.state + ' for ' + (lengthInMS/1000) + ' seconds...');

    const stopped = new Promise((resolve, reject) => {
      this.mediaRecorder.onstop = resolve;
      this.mediaRecorder.onerror = event => reject(event.name);
    });

  //   const recorded = this.wait(lengthInMS).then(
  //     () => this.mediaRecorder.state === 'recording' && this.mediaRecorder.stop()
  //   );

    if (this.webSocketInstance) {
      this.webSocketInstance.addEventListener('close', (e) => {
        console.log('WebSocket Close', e);
        if (this.mediaRecorder.state === 'recording') {
          this.mediaRecorder.stop();
        }
      });
    }

    // return Promise.all([
    //   stopped,
    //   // recorded
    // ])
    // .then(() => data);
  }

  startTimeCounter() {
    // start count up counter
    this.timerVar = setInterval(countTimer, 1000);
    let totalSeconds = 0;

    function countTimer() {
      ++totalSeconds;
      let hour: any = Math.floor(totalSeconds /3600);
      let minute: any = Math.floor((totalSeconds - hour*3600)/60);
      let seconds: any = totalSeconds - (hour*3600 + minute*60);
      if (hour < 10)
        hour = '0' + hour;
      if (minute < 10)
        minute = '0' + minute;
      if (seconds < 10)
        seconds = '0' + seconds;
      const timerElem = document.getElementById('timer');
      if (timerElem) {
        timerElem.innerHTML = hour + ':' + minute + ':' + seconds;
      }
    }
  }

  startSendingStreaming() {
    this.startSendingStreamingNow = true;

    // create new stream
    this.getLiveStreamDetails();
  }

  stop(stream) {
    if (stream && stream.getTracks()) {
      stream.getTracks().forEach(track => track.stop());
    }
    this.webSocketInstance.close();
  }

  openYoutubeLink(URL) {
    this.iab.create(URL, '_system', { location: 'no', zoom: 'yes', hideurlbar: 'yes' });
  }

  toggleShowServerLogMessages() {
    this.showServerLogMessages = !this.showServerLogMessages;
  }

}
