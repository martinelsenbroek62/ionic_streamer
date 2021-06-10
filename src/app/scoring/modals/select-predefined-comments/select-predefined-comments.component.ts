import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { CcutilService } from 'src/app/services/ccutil.service';

@Component({
  selector: 'app-select-predefined-comments',
  templateUrl: './select-predefined-comments.component.html',
  styleUrls: ['./select-predefined-comments.component.scss'],
})
export class SelectPredefinedCommentsComponent implements OnInit, OnDestroy {
  public title: any;
  public predefinedComments: any;

  constructor(public modalController: ModalController, public ccUtil: CcutilService, 
    private navParams: NavParams) {
    this.title = this.navParams.get('selectedTitle');
    this.predefinedComments = this.navParams.get('data');
  }

  ngOnInit() {
    // to close modal on click to hardware back button
    // https://dev.to/nicolus/closing-a-modal-with-the-back-button-in-ionic-5-angular-9-50pk
    const modalState = {
      modal : true,
      desc : 'fake state for our modal'
    };
    history.pushState(modalState, null);

    // do the rest functionality
  }

  ngOnDestroy() {
    // to close modal on click to hardware back button
    if (window.history.state.modal) {
      history.back();
    }
  }

  // to close modal on click to hardware back button
  // @HostListener('window:popstate', ['$event'])
  dismissModal() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      reload: false
    });
  }

  saveData(desc) {
    this.modalController.dismiss({desc});
  }

}
