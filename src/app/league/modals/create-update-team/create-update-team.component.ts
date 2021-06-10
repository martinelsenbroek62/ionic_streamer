import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { CcutilService } from 'src/app/services/ccutil.service';
import { LeagueService } from '../../services/league.service';

@Component({
  selector: 'app-create-update-team',
  templateUrl: './create-update-team.component.html',
  styleUrls: ['./create-update-team.component.scss'],
})
export class CreateUpdateTeamComponent implements OnInit {

  @Input() teamsObj;
  @Input() seriesList;
  @Input() clubId;
  @Input() seriesId;
  @Input() seriesDetails;

  ionicForm: FormGroup;
  isSubmitted = false;
  defaultDate = '1987-06-30';
  loadingSpinner = false;

  constructor(private modalController: ModalController, public formBuilder: FormBuilder, private leagueService: LeagueService, public ccUtil: CcutilService) { }

  ngOnInit() {
    this.ionicForm = this.formBuilder.group({
      seriesId: [this.seriesId ? this.seriesId : '', [Validators.required]],
      teamName: [(this.teamsObj && this.teamsObj.teamName) ? this.teamsObj.teamName : '', [Validators.required]],
    })
  }

  dismissModal(data?) {
    // using the injected ModalController this page
    // can 'dismiss' itself and optionally pass back data
    this.modalController.dismiss(data);
  }

  get errorControl() {
    return this.ionicForm.controls;
  }

  submitForm() {
    this.isSubmitted = true;
    if (!this.ionicForm.valid) {
      console.log('Please provide all the required values!')
      return false;
    } else {
      const data = this.ionicForm.value;
      console.log(data);
      // {seriesId: 75, teamName: "1"}
      this.createUpdateTeam(this.ionicForm.value);
    }
  }

  // call an API to get club details
  createUpdateTeam(data) {
    this.loadingSpinner = true;
    // get teamId when edit/update
    const teamId = (this.teamsObj && this.teamsObj.teamID) ? this.teamsObj.teamID : undefined;
    // call an API
    this.leagueService.createUpdateTeam(this.clubId, data.seriesId, data.teamName, teamId)
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
