import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CONSTANTS } from 'src/app/constants/constants';

@Injectable({
  providedIn: 'root'
})
export class SocialService {
  public headers = new HttpHeaders();

  constructor(public httpClient: HttpClient) {
    this.headers.set('Content-Type', 'application/json');
  }

  createPost(data) {
    return this.httpClient.post(CONSTANTS.API_ENDPOINT + 'CCAPI/post/create?X-Auth-Token=' + localStorage.getItem('X-Auth-Token'), 
    data, { headers: this.headers });
  }

  editPost(data, postId) {
    return this.httpClient.post(CONSTANTS.API_ENDPOINT + 'CCAPI/post/edit?X-Auth-Token=' + localStorage.getItem('X-Auth-Token') + '&postId=' + postId, 
    data, { headers: this.headers });
  }

  getAllPosts(){
    return this.httpClient.get(CONSTANTS.API_ENDPOINT + 'CCAPI/post/getAllUserPosts?X-Auth-Token=' + localStorage.getItem('X-Auth-Token'));
  }

  getUserHomeFeed(){
    return this.httpClient.get(CONSTANTS.API_ENDPOINT + 'CCAPI/post/get/homePageFeed/?X-Auth-Token=' + localStorage.getItem('X-Auth-Token'));
  }

  getPostInfo(postId){
    return this.httpClient.get(CONSTANTS.API_ENDPOINT + 'CCAPI/post/get/id/?X-Auth-Token=' + localStorage.getItem('X-Auth-Token') + '&postId=' + postId);
  }

  getPostComments(postId){
    return this.httpClient.get(CONSTANTS.API_ENDPOINT + 'CCAPI/comment/comments?X-Auth-Token=' + localStorage.getItem('X-Auth-Token') + '&postId=' + postId);
  }
  
  addPostComment(data, postId) {
    return this.httpClient.post(CONSTANTS.API_ENDPOINT + 'CCAPI/comment/create?X-Auth-Token=' + localStorage.getItem('X-Auth-Token') + '&postId=' + postId, 
    data, { headers: this.headers });
  }

  addCommentReply(data, commentId) {
    return this.httpClient.post(CONSTANTS.API_ENDPOINT + 'CCAPI/comment/replycomment?X-Auth-Token=' + localStorage.getItem('X-Auth-Token') + '&commentId=' + commentId, 
    data, { headers: this.headers });
  }

  saveImage(imageData){
    return this.httpClient.post(CONSTANTS.API_ENDPOINT + 'CCAPI/media/upload/image?X-Auth-Token=' + localStorage.getItem('X-Auth-Token'), 
    JSON.stringify(imageData), { headers: this.headers });
  }

  deletePost(postId){
    return this.httpClient.get(CONSTANTS.API_ENDPOINT + 'CCAPI/post/delete?X-Auth-Token=' + localStorage.getItem('X-Auth-Token') + '&postId=' + postId);
  }

  likeDislikePost(postId, likeDislike){
    return this.httpClient.get(CONSTANTS.API_ENDPOINT + 'CCAPI/post/like?X-Auth-Token=' + localStorage.getItem('X-Auth-Token') + '&postId=' + postId + '&likeDislike=' + likeDislike);
  }

  likeDislikeComment(commentId, likeDislike){
    return this.httpClient.get(CONSTANTS.API_ENDPOINT + 'CCAPI/comment/like?X-Auth-Token=' + localStorage.getItem('X-Auth-Token') + '&commentId=' + commentId + '&likeDislike=' + likeDislike);
  }

  editCommentOrReply(data, commentId){
    return this.httpClient.post(CONSTANTS.API_ENDPOINT + 'CCAPI/comment/edit?commentId=' + commentId + '&X-Auth-Token=' + localStorage.getItem('X-Auth-Token'), 
    data, { headers: this.headers });
  }

  deleteCommentOrReply(commentId){
    return this.httpClient.get(CONSTANTS.API_ENDPOINT + 'CCAPI/comment/delete?X-Auth-Token=' + localStorage.getItem('X-Auth-Token') + '&commentId=' + commentId);
  }
}
