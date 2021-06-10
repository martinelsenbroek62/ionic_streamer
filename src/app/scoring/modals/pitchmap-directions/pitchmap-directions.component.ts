import { Component, OnInit, Input } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';

@Component({
  selector: 'app-pitchmap-directions',
  templateUrl: './pitchmap-directions.component.html',
  styleUrls: ['./pitchmap-directions.component.scss'],
})
export class PitchmapDirectionsComponent implements OnInit {
  // Data passed in by componentProps
  // get value of match details passed from live-scoring-list page
  @Input() disableWagonWheel: any;
  @Input() disablePitchMap: any;

  public ballDirection:any  = {
    pX: 995,
    pY: 895,
  };;
  private deviceWidth;
  public angleDeg: any;
  public ballDistance: any;
  public distPerc: any;
  // public disableWagonWheel: boolean = false;
  // public disablePitchMap: boolean = false;
  public showWagonWheelAfterPitch: boolean = false;
  private direction: string = "undefined;undefined;undefined";
  private pitchMapData: string = '';

  public topColors:any;
  public px1: any;
  public px2: any;
  public py1: any;
  public py2: any;
  public ps1: any;
  public ps2: any;
  public bottomCellNumber: any;
  public topCellNumber: any;

  constructor(private platform: Platform, private modalController: ModalController) {
  }

  ngOnInit() {
    this.deviceWidth = this.platform.width();
    // this.disableWagonWheel = this.navParams.get('disableWagonWheel');
    // this.disablePitchMap = this.navParams.get('disablePitchMap');
    if(!this.disableWagonWheel && this.disablePitchMap)
      this.showWagonWheelAfterPitch = true;

    this.px1 = 200;
    this.py1 = 680;
    this.px2 = 200;
    this.py2 = 680;
    this.ps1 = 200;
    this.ps2 = 680;

    this.topColors = [];
    for(let i =0; i < 9; i++){
      this.topColors.push("#FFF2E2");
    }
  }

  dismissModal() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({});
  }

  saveDirections() {
    this.direction = this.angleDeg+';'+this.ballDistance+';'+this.distPerc+'-'+(this.ballDirection.pX).toFixed(2)+',' +(this.ballDirection.pY).toFixed(2);
    // this.viewCtrl.dismiss({data: this.angleDeg+';'+this.ballDistance+';'+this.distPerc+'-'+(this.ballDirection.pX).toFixed(2)+',' +(this.ballDirection.pY).toFixed(2)});
    
    this.modalController.dismiss({direction: this.direction, pitchMapData: this.pitchMapData});
  }

  setBallDirection(ev,width){
    // console.log(ev,width);
    ev.preventDefault();
    this.deviceWidth = width;
    let ratio = 2101/(this.deviceWidth-16);
    this.ballDirection.pX = ev.offsetX*ratio;
    this.ballDirection.pY = ev.offsetY*ratio;
    console.log(this.ballDirection.pX + ',' + this.ballDirection.pY);

    this.angleDeg = Math.ceil(Math.atan2(this.ballDirection.pY - 895, this.ballDirection.pX - 995) * 180 / Math.PI);
    this.angleDeg = this.angleDeg + 90;
    if(this.angleDeg < 0)
    this.angleDeg = this.angleDeg + 360;
    //console.log(this.angleDeg, ' Degrees');
    this.ballDistance = Math.ceil(Math.sqrt((995-this.ballDirection.pX)*(995-this.ballDirection.pX)+(895-this.ballDirection.pY)*(895-this.ballDirection.pY)));
    //console.log('Distance ',this.ballDistance);
    this.distPerc = 0;
    this.distPerc = Math.ceil(this.ballDistance*100/1024);
    //console.log(this.distPerc,' %');
  }

  bottomMap(ev, cellNumber, lineNumber){
    // console.log("event:",ev);
    this.bottomCellNumber = cellNumber;
    if(lineNumber == 1){
      this.ps1 = 25;
      this.ps2 = 540;
    }else if(lineNumber == 2){
      this.ps1 = 150;
      this.ps2 = 540;
    }else if(lineNumber == 3){
      this.ps1 = 273;
      this.ps2 = 540;
    }

    this.px1 = ev.offsetX;
    this.py1 = ev.offsetY;
    this.px2 = ev.offsetX;
    this.py2 = ev.offsetY;
    this.topColors = [];

    for(let i =0; i < 9; i++){
      this.topColors.push("#FFF2E2");
    }
  }

  topMap(ev, number){
    this.topCellNumber = number+1;
    if(this.px1 == undefined)
      this.px1 = ev.ev.offsetX;
    if(this.py1 == undefined)
      this.py1 = ev.offsetY;

    this.px2 = ev.offsetX;
    this.py2 = ev.offsetY;
    this.topColors = [];

    for(let i =0; i < 9; i++){
      if(i != number)
        this.topColors.push("#FFF2E2");
      if(i == number)
        this.topColors.push("#B3B3B3");
    }
  }

  savePitchMap(){
    this.pitchMapData = this.topCellNumber+'-'+this.bottomCellNumber+'-'+this.px1+';'+this.py1+'-'+this.px2+';'+this.py2;
    if(this.disableWagonWheel == false){
      this.showWagonWheelAfterPitch = true;
    }else{
      this.modalController.dismiss({direction: this.direction, pitchMapData: this.pitchMapData});
    }
  }

}
