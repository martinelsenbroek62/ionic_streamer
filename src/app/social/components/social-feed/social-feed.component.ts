import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { CcutilService } from 'src/app/services/ccutil.service';
import { SocialService } from 'src/app/social/services/social.service';

@Component({
  selector: 'app-social-feed',
  templateUrl: './social-feed.component.html',
  styleUrls: ['./social-feed.component.scss'],
})
export class SocialFeedComponent implements OnInit {
  @Input() postsList:any;
  @Output() showPostActions: EventEmitter<any> = new EventEmitter();

  showFullContent: any = [];
  showComments: any = [];
  showEditComment: any = [];
  addComment: any = [];
  editCommentOrReply: any = [];
  editReplyComment: any = [];
  commentsList: any = [];
  addCommentReply: any = [];
  showEditReplyCommentIndex: string = '';
  showReplyIndex: string = '';
  authToken: any;
  loggedInUserId: any;

  constructor(public ccUtil: CcutilService, private router: Router, private socialApi: SocialService) { }

  ngOnInit() {
    this.authToken = localStorage.getItem('X-Auth-Token');
    this.loggedInUserId = localStorage.getItem('userId');
  }

  async onPostActions(event, postId) {
    this.showPostActions.emit({ event, postId }); // emit event here
  }

  showPostDetails(postId){
    this.router.navigate(['/post-details'], { state: { postId: postId} });
  }

  updateReplyIndex(commentId){
    if(this.showReplyIndex == commentId)
      this.showReplyIndex = '';
    else
      this.showReplyIndex = commentId;
  }

  showEditReply(replyId){
    this.showEditReplyCommentIndex = replyId;
  }

  getCommentsForPost(postId, index){
    this.showComments[index] = !this.showComments[index]
    this.socialApi.getPostComments(postId)
      .subscribe((response: any) => {
        if (response.data) {
          this.commentsList[index] = response.data;
        }
      },(error) => {
        console.log('Api error : ' + error);
        if(error.name == 'HttpErrorResponse')
          this.ccUtil.messageAlert('Get Comments Failed', 'Please check your Network Connection');
        else
          this.ccUtil.messageAlert('Get Comments Failed', error.message);
      });
  }

  createComment(postId, index){
    const data = {
      content: this.addComment[index]
    }
    this.socialApi.addPostComment(data, postId)
      .subscribe((response: any) => {
        if (response.data) {
          this.getCommentsForPost(postId, index);
          this.addComment[index] = "";
        } else {
          this.ccUtil.messageAlert('Add Comment Failed', response.errorMessage);
        }
      },(error) => {
        console.log('Api error : ' + error);
        if(error.name == 'HttpErrorResponse')
          this.ccUtil.messageAlert('Add Comment Failed', 'Please check your Network Connection');
        else
          this.ccUtil.messageAlert('Add Comment Failed', error.message);
      });
  }

  createCommentReply(postId, commentId, index){
    this.socialApi.addCommentReply(this.addCommentReply[index], commentId)
      .subscribe((response: any) => {
        if (response.data) {
          this.getCommentsForPost(postId, index);
          this.addCommentReply[index] = "";
        } else {
          this.ccUtil.messageAlert('Add Comment Reply Failed', response.errorMessage);
        }
      },(error) => {
        console.log('Api error : ' + error);
        if(error.name == 'HttpErrorResponse')
          this.ccUtil.messageAlert('Add Comment Reply Failed', 'Please check your Network Connection');
        else
          this.ccUtil.messageAlert('Add Comment Reply Failed', error.message);
      });
  }

  likeDislikeComment(postId, commentId, index){
    this.socialApi.likeDislikeComment(commentId, 1)
      .subscribe((response: any) => {
        if (response.data) {
          this.getCommentsForPost(postId, index);
        }
      },(error) => {
        console.log('Api error : ' + error);
        if(error.name == 'HttpErrorResponse')
          this.ccUtil.messageAlert('Get Comments Failed', 'Please check your Network Connection');
        else
          this.ccUtil.messageAlert('Get Comments Failed', error.message);
      });
  }

  editComment(commentId, postId, content, index){
    
    const data = {
      // content: this.editCommentOrReply[index]
      content: content
    }
    this.socialApi.editCommentOrReply(data, commentId)
      .subscribe((response: any) => {
        if (response.data) {
          this.getCommentsForPost(postId, index);
          this.addComment[index] = "";
        } else {
          this.ccUtil.messageAlert('Add Comment Failed', response.errorMessage);
        }
      },(error) => {
        console.log('Api error : ' + error);
        if(error.name == 'HttpErrorResponse')
          this.ccUtil.messageAlert('Add Comment Failed', 'Please check your Network Connection');
        else
          this.ccUtil.messageAlert('Add Comment Failed', error.message);
      });
  }

  deleteCommentOrReply(commentId, postId, index){
    this.socialApi.deleteCommentOrReply(commentId)
      .subscribe((response: any) => {
        if (response.data) {
          this.getCommentsForPost(postId, index);
        }
      },(error) => {
        console.log('Api error : ' + error);
        if(error.name == 'HttpErrorResponse')
          this.ccUtil.messageAlert('Get Comments Failed', 'Please check your Network Connection');
        else
          this.ccUtil.messageAlert('Get Comments Failed', error.message);
      });
  }

}
