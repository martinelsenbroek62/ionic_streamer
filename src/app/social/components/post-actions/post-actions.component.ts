import { Component, OnInit, ViewChild } from '@angular/core';
import { NavParams } from '@ionic/angular';
import { CcutilService } from 'src/app/services/ccutil.service';
import { SocialService } from '../../services/social.service';
import { PopoverController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post-actions',
  templateUrl: './post-actions.component.html',
  styleUrls: ['./post-actions.component.scss'],
})
export class PostActionsComponent implements OnInit {
  postId: any;
  loadingSpinner: any;

  constructor(private navparams: NavParams, public ccUtil: CcutilService, private socialApi: SocialService, 
    private popoverCtrl: PopoverController, private router: Router) {

    this.postId = this.navparams.get('postId');
    console.log(this.postId);
  }

  ngOnInit() {}

  editPost(){
    this.popoverCtrl.dismiss();
    this.router.navigate(['/create-post'], { state: { postId: this.postId} });
  }

  deletePost(){
    this.popoverCtrl.dismiss();
    // show loader
    this.loadingSpinner = true;

    this.socialApi.deletePost(this.postId)
      .subscribe((value: any) => {
        // hide loader
        this.loadingSpinner = false;

        // check response
        if (value.responseState && value.data) {
          console.log('Post deleted successfully');
        } else {
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
