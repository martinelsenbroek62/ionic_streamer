import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CcutilService } from 'src/app/services/ccutil.service';
import { SocialService } from '../services/social.service';

@Component({
  selector: 'app-post-details',
  templateUrl: './post-details.page.html',
  styleUrls: ['./post-details.page.scss'],
})
export class PostDetailsPage implements OnInit {
  postId: any;
  errorMessage: string = ''; 
  loadingSpinner: any;
  postInfo: any = [];
  commentsList: any;

  constructor(private router: Router, private socialApi: SocialService, 
    public ccUtil: CcutilService) {
    if(this.router.getCurrentNavigation().extras.state){
      this.postId = this.router.getCurrentNavigation().extras.state.postId;
      this.getPostDetails();
    }
  }

  ngOnInit() {
  }

  doRefresh(event) {
    // on page reload by pull to refresh
    this.getPostDetails(() => {
      event.target.complete();
    });
  }

  getPostComments(){
    // show loader
    this.loadingSpinner = true;
    this.errorMessage = '';

    this.socialApi.getPostComments(this.postId)
      .subscribe((value: any) => {
        
        // hide loader
        this.loadingSpinner = false;

        // check response
        if (value.responseState && value.data) {
          this.commentsList = value.data;
        } else {
          // if(value.errorMessage){
          //   this.errorMessage = value.errorMessage;
          // }
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

  getPostDetails(callback?){
    // show loader
    this.loadingSpinner = true;
    this.errorMessage = '';

    this.socialApi.getPostInfo(this.postId)
      .subscribe((value: any) => {
        if (callback) {
          callback();
        }
        // hide loader
        this.loadingSpinner = false;

        // check response
        if (value.responseState && value.data) {
          this.postInfo.push(value.data);
          this.getPostComments();
          // if(!value.data.length){
          //   this.errorMessage = 'No Feeds';
          // }
        } else {
          console.log('Failed to call API');
          if(value.errorMessage){
            this.errorMessage = value.errorMessage;
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
