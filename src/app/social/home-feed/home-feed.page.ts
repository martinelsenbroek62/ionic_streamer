import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SocialService } from '../services/social.service';
import { CcutilService } from 'src/app/services/ccutil.service';
import { PopoverController } from '@ionic/angular';
import { PostActionsComponent } from '../components/post-actions/post-actions.component';


@Component({
  selector: 'app-home-feed',
  templateUrl: './home-feed.page.html',
  styleUrls: ['./home-feed.page.scss'],
})
export class HomeFeedPage implements OnInit {
  postsList: any;
  errorMessage: string = ''; 
  loadingSpinner: any;
  showFullContent: any = [];

  constructor(private router: Router, private socialApi: SocialService, public ccUtil: CcutilService, 
    private popoverCtrl: PopoverController) { }

  ngOnInit() {
    this.getUserHomeFeed();
  }

  createPost(){
    this.router.navigate(['/create-post']);
  }

  showImageVideo(){
    this.router.navigate(['/image-video-info']);
  }

  doRefresh(event) {
    // on page reload by pull to refresh
    this.getUserHomeFeed(() => {
      event.target.complete();
    });
  }

  likeOrDislikePost(postId, likeDislike){
    if (localStorage.getItem('X-Auth-Token')){
      // show loader
      this.loadingSpinner = true;
      this.socialApi.likeDislikePost(postId, likeDislike)
        .subscribe((value: any) => {
          // hide loader
          this.loadingSpinner = false;
          this.getUserHomeFeed();
        }, (error) => {
          // hide loader
          this.loadingSpinner = false;
          console.log('Api error');
          if(error.name == 'HttpErrorResponse')
            this.ccUtil.fail_modal('Please check your Network Connection');
          else
            this.ccUtil.fail_modal(error.message);
        });
    } else {
      this.ccUtil.loginAlert();
    }
  }

  async showPostActions(ev) {
    const popover = await this.popoverCtrl.create({
      component: PostActionsComponent,
      cssClass: 'my-custom-class',
      event: ev.event,
      componentProps: {postId: ev.postId},
      translucent: true
    });

    popover.onDidDismiss().then((data) => {
      this.getUserHomeFeed();
    });
    
    return await popover.present();
  }

  showPostDetails(postId){
    this.router.navigate(['/post-details'], { state: { postId: postId} });
  }

  getPostComments(postId){
    // show loader
    this.loadingSpinner = true;
    this.errorMessage = '';

    this.socialApi.getPostComments(postId)
      .subscribe((value: any) => {
        
        // hide loader
        this.loadingSpinner = false;

        // check response
        if (value.responseState && value.data) {
          this.postsList = value.data;
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

  getUserHomeFeed(callback?){
    // show loader
    this.loadingSpinner = true;
    this.errorMessage = '';

    this.socialApi.getUserHomeFeed()
      .subscribe((value: any) => {
        if (callback) {
          callback();
        }
        // hide loader
        this.loadingSpinner = false;

        // check response
        if (value.responseState && value.data) {
          this.postsList = value.data;
          if(!value.data.length){
            this.errorMessage = 'No Feeds';
          }
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

  getAllPosts(callback?){
    // show loader
    this.loadingSpinner = true;
    this.errorMessage = '';

    this.socialApi.getAllPosts()
      .subscribe((value: any) => {
        if (callback) {
          callback();
        }
        // hide loader
        this.loadingSpinner = false;

        // check response
        if (value.responseState && value.data) {
          this.postsList = value.data;
          if(!value.data.length){
            this.errorMessage = 'No Feeds';
          }
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
