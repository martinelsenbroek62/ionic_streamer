import { Component, HostListener, OnDestroy, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CcutilService } from 'src/app/services/ccutil.service';
import { SelectPredefinedCommentsComponent } from '../select-predefined-comments/select-predefined-comments.component';

@Component({
  selector: 'app-add-comment',
  templateUrl: './add-comment.component.html',
  styleUrls: ['./add-comment.component.scss'],
})
export class AddCommentComponent implements OnInit, OnDestroy {
  @Input() matchType: any;

  public matchLevel: any;
  public comments: any;
  public showError = false;
  public showErrorDataTooLong = false;
  public predefinedComments: any = {};
  public commentLongOff: any;
  private batsmanName: string;

  constructor(public modalController: ModalController, public ccUtil: CcutilService) { }

  ngOnInit() {
    // to close modal on click to hardware back button
    // https://dev.to/nicolus/closing-a-modal-with-the-back-button-in-ionic-5-angular-9-50pk
    // const modalState = {
    //   modal : true,
    //   desc : 'fake state for our modal'
    // };
    // history.pushState(modalState, null);

    // do the rest functionality
    // this.matchType = this.navParams.get('data')
    // this.batsmanName = this.navParams.get('batsmanName')

    if (this.matchType === 'superOver') {
      this.matchLevel = true;
    } else {
      this.matchLevel = false;
    }
  }

  ngOnDestroy() {
    // to close modal on click to hardware back button
    // if (window.history.state.modal) {
    //   history.back();
    // }
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

  async setAutoComment(title) {
    // set predefined comments
    this.setPredefinedComments(title);
    /* open add-comment in modal to get data back to this page when modal closed */
    const modal = await this.modalController.create({
      component: SelectPredefinedCommentsComponent,
      cssClass: '',
      componentProps: {
        selectedTitle: title,
        data: this.predefinedComments
      }
    });
    await modal.present();

    const resp: any = await modal.onDidDismiss();
    if (resp && resp.data && resp.data.desc) {
      // set in input field
      this.comments = resp.data.desc;
    }
  }

  saveComments() {
    this.showError = false;
    this.showErrorDataTooLong = false;
    if(!this.comments){
      this.showError = true;
    }else if(this.comments.length > 500){
      this.showErrorDataTooLong = true;
    } else{
      this.modalController.dismiss({
        matchLevel: this.matchLevel,
        comments: this.comments
      });
    }
  }

  setPredefinedComments(title){
    if(title == 'LongOff'){
      this.predefinedComments = [{'id': 1, 'desc': 'Wow! Supreme use of the feet by '+this.batsmanName+'. Dances down the track to a length ball outside off and spanks it to long off for a boundary. That went to the fence like a tracer bullet.'},
                              {'id': 2, 'desc': 'SIX! Bang! '+this.batsmanName+' likes it there. Thats a top class shot. Short in length wide outside off, '+this.batsmanName+' latches onto it and slams it over long off. It goes all the way'},
                              {'id': 3, 'desc': 'driven superbly towards long off'},
                              {'id': 4, 'desc': 'Its a big hit over long off for six. Mighty strike!!!'},
                              {'id': 5, 'desc': 'thumps it right over long-off for a glorious six'}];
    }else if(title == 'ThirdMan'){
    this.predefinedComments = [{'id': 1, 'desc': 'Thick outside edge towards third man and finds the boundary'},
                              {'id': 2, 'desc': this.batsmanName+' cuts it through thrid man fence'}];
    }else if(title == 'Point'){
    this.predefinedComments = [{'id': 1, 'desc': 'cracking square drive through point. That reached the fence in a jiffy'},
                                    {'id': 2, 'desc': 'makes room and slashes it towards point for four runs'},
                                    {'id': 3, 'desc': 'hits hard right over point for half-a-dozen. Massive! Clean Hit !'},
                                    {'id': 4, 'desc': 'SIX! Bang! '+this.batsmanName+' likes it there. Thats a top class shot. Short in length wide outside off, James latches onto it and slams it over point. It goes all the way'},
                                    {'id': 5, 'desc': 'cracking square drive through point. That reached the fence in a jiffy'}];
    }else if(title == 'Cover'){
      this.predefinedComments = [{'id': 1, 'desc': 'Pushed towards cover'},
                                {'id': 2, 'desc': 'Driven superbly through covers & Finds a boundary'},
                                {'id': 3, 'desc': 'make room and slams it wide of cover'}];
    }else if(title == 'Wide'){
      this.predefinedComments = [{'id': 1, 'desc': 'wide, fired outside off, just misses the tramline though, wide called by Umpire'}];
    }else if(title == 'SquareLeg'){
      this.predefinedComments = [{'id': 1, 'desc': 'sweeps it over backward square leg for a boundary'},
                                {'id': 2, 'desc': 'pulls it away wide of deep square leg for a boundary'}];
    }else if(title == 'Straight'){
      this.predefinedComments = [{'id': 1, 'desc': 'smashes the big hit straight down the ground and sends it sailing over the sightscreen'},
                                {'id': 2, 'desc': 'Glorious Straight Drive by '+this.batsmanName+' -- & Looks in Good touch'}];
    }else if(title == 'MidWicket'){
      this.predefinedComments = [{'id': 1, 'desc': 'pulled into the gap between midwicket and mid-on. Too short, picked the length early'},
                                {'id': 2, 'desc': 'tucks it to the right of mid-wicket'},
                                {'id': 3, 'desc': 'slog-sweeps it over midwicket for six. Mighty strike'},
                                {'id': 2, 'desc': 'pulls it over deep Mid-wicket for a boundary'}];
    }
  }

}
