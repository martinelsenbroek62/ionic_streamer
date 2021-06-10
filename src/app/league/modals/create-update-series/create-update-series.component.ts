import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { LeagueService } from '../../services/league.service';
import { CcutilService } from 'src/app/services/ccutil.service';

@Component({
  selector: 'app-create-update-series',
  templateUrl: './create-update-series.component.html',
  styleUrls: ['./create-update-series.component.scss'],
})
export class CreateUpdateSeriesComponent implements OnInit {

  @Input() seriesObj;
  @Input() clubId;

  formData: FormGroup;
  isSubmitted = false;
  loadingSpinner = false;

  oversArray: any = [];
  maxPlayersPerTeam: any = [];
  playerLimitTeamRoster: any = [];
  BallTypes: any = [];
  SeriesTypes: any = [];
  maxDate:any;

  constructor(private modalController: ModalController, public formBuilder: FormBuilder, private leagueService: LeagueService, public ccUtil: CcutilService) {
  }

  ngOnInit() {
    this.maxDate = (new Date()).getFullYear()+3;

    // set initial values
    this.formData = this.formBuilder.group({
      name: [(this.seriesObj && this.seriesObj.name) ? this.seriesObj.name : '', [Validators.required]],
      startDate: [new Date(), [Validators.required]],
      groups: [1, [Validators.required, Validators.pattern('^[0-9]+$')]],
      maxOvers: [20, [Validators.required, Validators.pattern('^[0-9]+$')]],
      teamLimit: [0, [Validators.required, Validators.pattern('^[0-9]+$')]],
      maximumPlayers: [11, [Validators.required, Validators.pattern('^[0-9]+$')]],
      ballType: ['Hard Tennis Ball', [Validators.required]],
      seriesType: [(this.seriesObj && this.seriesObj.seriesType) ? this.seriesObj.seriesType : 'Twenty20', [Validators.required]],
      winPoints: [2, [Validators.required, Validators.pattern('^[0-9]+$')]],
      bonusPoints: [0, [Validators.required, Validators.pattern('^[0-9]+$')]]
    });

    if (this.seriesObj && this.seriesObj.seriesID) {
      // get other series details to set
      this.getSeriesDetails();
    }

    // set default data
    this.setStaticData();
  }

  dismissModal(data?) {
    // using the injected ModalController this page
    // can 'dismiss' itself and optionally pass back data
    this.modalController.dismiss(data);
  }

  setStaticData() {
    for (let i=1; i<101; i++) {
      this.oversArray.push(i);
    }
    for (let i=6; i<12; i++) {
      this.maxPlayersPerTeam.push(i);
    }
    for (let i=1; i<51; i++) {
      this.playerLimitTeamRoster.push(i);
    }
    this.BallTypes = [
      {id: 'Hard Tennis Ball', name: 'Hard Tennis Ball'},
      {id: 'Leather Ball', name: 'Leather Ball'},
      {id: 'Taped Ball', name: 'Taped Ball'},
      {id: 'Soft Ball', name: 'Soft Ball'},
      {id: 'Others', name: 'Others'}
    ];
    this.SeriesTypes = [
      {id: 'Twenty20', name: 'Twenty20 (16-25 overs)'},
      {id: 'One Day', name: 'One Day (26-50 overs)'},
      {id: 'Ten10', name: 'Ten10 (2-15 overs)'},
      {id: 'Test', name: 'Test'},
      {id: 'Youth', name: 'Youth'},
      {id: 'Women', name: 'Women'},
      {id: '2X', name: '2X Innings (Beta)'},
      {id: '100b', name: '100 Ball (Beta)'}
    ];
  }

  getDate(e) {
    const date = new Date(e.target.value).toISOString().substring(0, 10);
    this.formData.get('dob').setValue(date, {
      onlyself: true
    })
  }

  get errorControl() {
    return this.formData.controls;
  }

  submitForm() {
    this.isSubmitted = true;
    if (!this.formData.valid) {
      console.log('Please provide all the required values!')
      return false;
    } else {
      console.log(this.formData.value);
      this.createUpdateSeries(this.formData.value);
    }
  }

  getSeriesDetails() {
    this.loadingSpinner = true;
    // get teamId when edit/update
    const seriesId = (this.seriesObj && this.seriesObj.seriesID) ? this.seriesObj.seriesID : undefined;
    // call an API
    this.leagueService.getSeriesDetails(this.clubId, seriesId)
    .subscribe((value: any) => {
      // hide loader
      this.loadingSpinner = false;
      // check response
      if (value.responseState && value.data) {
        const seriesData = value.data;
        console.log('seriesData', seriesData);
        this.formData.setValue({
          name: seriesData.name,
          groups: seriesData.groups,
          winPoints: seriesData.winPoints,
          bonusPoints: seriesData.bonusPoints,
          maxOvers: seriesData.maxOvers,
          maximumPlayers: seriesData.maximumPlayers,
          teamLimit: seriesData.teamLimit,
          ballType: seriesData.ballType,
          seriesType: seriesData.seriesType,
          startDate: seriesData.startDate
        });
      } else {
        console.log('Failed to call API');
        if (value.errorMessage) {
          this.ccUtil.fail_modal(value.errorMessage);
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

  // call an API to get club details
  createUpdateSeries(data) {
    this.loadingSpinner = true;
    // get teamId when edit/update
    const seriesId = (this.seriesObj && this.seriesObj.seriesID) ? this.seriesObj.seriesID : undefined;
    if (seriesId) {
      data.seriesId = seriesId;
      data.clubId = this.clubId;
      // leagueId is seriesId
      data.leagueId = seriesId;
    }
    // call an API
    this.leagueService.createUpdateSeries(this.clubId, data, seriesId)
    .subscribe((value: any) => {
      // hide loader
      this.loadingSpinner = false;
      // check response
      if (value.responseState && value.data) {
        this.ccUtil.presentToast(value.data);
        this.dismissModal({isRelad: true});
      } else {
        console.log('Failed to call API');
        if (value.errorMessage) {
          this.ccUtil.fail_modal(value.errorMessage);
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

}
