import { Component, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CcutilService } from 'src/app/services/ccutil.service';

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss'],
})
export class ActionsComponent implements OnInit, OnDestroy {
  // Data passed in by componentProps
  // get value of match details passed from live-scoring-list page
  @Input() actionsData: any;
  @Input() actionType: any;

  clickedProp: any;

  constructor(public modalController: ModalController, public ccUtil: CcutilService) { }

  ngOnInit() {
    // this.extrasAsGoodBall = this.data.extrasAsGoodBall;
    // to close modal on click to hardware back button
    // https://dev.to/nicolus/closing-a-modal-with-the-back-button-in-ionic-5-angular-9-50pk
    const modalState = {
      modal : true,
      desc : 'fake state for our modal'
    };
    history.pushState(modalState, null);
  }

  ngOnDestroy() {
    // to close modal on click to hardware back button
    if (window.history.state.modal) {
      history.back();
    }
  }

  // to close modal on click to hardware back button
  @HostListener('window:popstate', ['$event'])
  dismissModal() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      actionType: this.actionType,
      actionsData: this.actionsData,
      clickedProp: this.clickedProp
    });
  }

  setAction(actionType) {
    this.actionType = actionType;
    this.dismissModal();
  }

  setClickedProp(clickedProp) {
    this.clickedProp = clickedProp;
    this.dismissModal();
  }

}
