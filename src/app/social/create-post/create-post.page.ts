import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { FriendsListPage } from '../friends-list/friends-list.page';
import { CcutilService } from 'src/app/services/ccutil.service';
import { SocialService } from '../services/social.service';
import { Router } from '@angular/router';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { CONSTANTS } from 'src/app/constants/constants';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.page.html',
  styleUrls: ['./create-post.page.scss'],
})
export class CreatePostPage implements OnInit {

  createPostForm: FormGroup;
  createPostSubmitted: boolean = false;
  selectSharingId: any;
  showImg: boolean = false;
  postDescription: any;
  hashTags: any = [];
  imageUrl: string = '';
  videoUrl: string = '';
  loadingSpinner: any;
  postId: any;
  postInfo: any = {};

  constructor(public formbuilder: FormBuilder, public actionSheetController: ActionSheetController, 
    private modalController: ModalController, public ccUtil: CcutilService, private socialApi: SocialService, 
    private router: Router, private camera:Camera, private transfer: FileTransfer) {

    if(this.router.getCurrentNavigation().extras.state){
      this.postId = this.router.getCurrentNavigation().extras.state.postId;
      this.getPostInfo();
    }
  }

  ngOnInit() {
    this.postDescription = '';
    this.createPostForm = this.formbuilder.group({
      message: new FormControl('', [Validators.required])
    });
    this.selectSharingId = 'private';
  }

  get createPostFormControl() {
    return this.createPostForm.controls;
  }

  getHashTags(){
    if(this.postDescription){
      let hashIndex = this.postDescription.indexOf("#");
      if(hashIndex > 0){
        let tempArr = this.postDescription.split('#');
        let spaceIndex = this.postDescription.indexOf(" ");
        this.hashTags.push(tempArr[1].substring(hashIndex, spaceIndex));
      }
    }
  }

  async selectImage() {
    const actionSheet = await this.actionSheetController.create({
        header: 'Select Image source',
        buttons: [{
                text: 'Load from Library',
                handler: () => {
                    this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
                }
            },
            {
                text: 'Use Camera',
                handler: () => {
                    this.takePicture(this.camera.PictureSourceType.CAMERA);
                }
            },
            {
                text: 'Cancel',
                role: 'cancel'
            }
        ]
    });
    await actionSheet.present();
}

takePicture(sourceType) {
    const options: CameraOptions = {
        quality: 100,
        sourceType: sourceType,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE
    };
    this.camera.getPicture(options).then((imageData) => {
        // imageData is either a base64 encoded string or a file URI
        // If it's base64 (DATA_URL):
        let base64Image = 'data:image/jpeg;base64,' + imageData;
        console.log(base64Image);          
        this.uploadImage(base64Image);
    }, (err) => {
        // Handle error
    });
  }

  uploadImage(base64Image) {
    // show loader
    this.loadingSpinner = true;

    this.socialApi.saveImage(base64Image)
      .subscribe((response: any) => {
        // hide loader
        this.loadingSpinner = false;

        if (response.data) {
          this.imageUrl = response.data;
          this.ccUtil.messageAlert('Image Upload', 'Image Uploaded Successfully');
        } else {
          this.ccUtil.messageAlert('Image Upload Failed', response.errorMessage);
        }
      },(error) => {
        // hide loader
        this.loadingSpinner = false;
        
        console.log('Api error : ' + error);
        if(error.name == 'HttpErrorResponse')
          this.ccUtil.messageAlert('Image Upload Failed', 'Please check your Network Connection');
        else
          this.ccUtil.messageAlert('Image Upload Failed', error.message);
      });
  }

  // uploadVideo() {
  //   // create file transfer object
  //   const fileTransfer: FileTransferObject = this.transfer.create();

  //   // timestamp name
  //   const random = new Date().valueOf();

  //   // option transfer
  //   const options: FileUploadOptions = {
  //     fileKey: 'photo',
  //     fileName: 'z_' + random + '.jpeg',
  //     chunkedMode: false,
  //     httpMethod: 'post',
  //     mimeType: 'image/jpeg',
  //     headers: {}
  //   };

  //   // file transfer action
  //   fileTransfer.upload( , CONSTANTS.API_ENDPOINT + 'CCAPI/media/upload/image?X-Auth-Token=' + localStorage.getItem('X-Auth-Token'), options)
  //     .then((r) => {
  //       const response = JSON.parse(r.response);
  //       this.imageUrl = r.response;
  //       this.ccUtil.messageAlert('Image Upload', 'Details Submitted Successfully');
        
  //     }, (err) => {
  //       console.log(err);
  //   });
  // }

  savePost(){
    // To find hash tags
    var regexp = /\B\#\w\w+\b/g
    this.hashTags = this.postDescription.match(regexp);
    console.log(this.hashTags);

    if(this.hashTags && this.hashTags.length > 0){
      this.hashTags.forEach(tag => {
        this.postDescription = this.postDescription.replace(tag, "");
      });
    }
    
    let data = {
      postId: this.postId,
      title: '',
      content: this.postDescription,
      shareWith: this.selectSharingId,
      imageUrl: this.imageUrl,
      videoUrl: this.videoUrl,
      hashTags:  this.hashTags
    }

    if(this.postId){
      this.editPost(data);
    }else {
      this.createPost(data);
    }
  }

  editPost(data){
    this.socialApi.editPost(data, this.postId)
      .subscribe((response: any) => {
        if (response.data) {
          this.router.navigate(['/home-feed']);
        } else {
          this.ccUtil.messageAlert('Edit Post Failed', response.errorMessage);
        }
      },(error) => {
        console.log('Api error : ' + error);
        if(error.name == 'HttpErrorResponse')
          this.ccUtil.messageAlert('Edit Post Failed', 'Please check your Network Connection');
        else
          this.ccUtil.messageAlert('Edit Post Failed', error.message);
      });
  }

  createPost(data){
    
    this.socialApi.createPost(data)
      .subscribe((response: any) => {
        if (response.data) {
          this.router.navigate(['/home-feed']);
        } else {
          this.ccUtil.messageAlert('Create Post Failed', response.errorMessage);
        }
      },(error) => {
        console.log('Api error : ' + error);
        if(error.name == 'HttpErrorResponse')
          this.ccUtil.messageAlert('Create Post Failed', 'Please check your Network Connection');
        else
          this.ccUtil.messageAlert('Create Post Failed', error.message);
      });
  }

  async addToYourPost(){
    const actionSheet = await this.actionSheetController.create({
      // header: 'Select',
      cssClass: '',
      buttons: [
        {
          text: 'Add Image',
          icon: 'images',
          handler: () => {
            //add image or video function
            this.showImg=!this.showImg
            this.selectImage();
          }
        },
        {
          text: 'Add Video',
          icon: 'videocam',
          handler: () => {
            //add image or video function
            this.showImg=!this.showImg
          }
        },
        {
          text: 'Tag Friends',
          icon: 'person-add',
          handler: () => {
            //open modal with friends list
            this.tagFriendsModal();
          }
        },
        // {
        //   text: 'Scorecard',
        //   icon: 'easel',
        //   handler: () => {
        //     // share scorecard
        //   }
        // },
        // {
        //   text: 'Feeling',
        //   icon: 'happy',
        //   handler: () => {
        //     // show different emojis
        //   }
        // },
        {
          text: 'Cancel',
          icon: 'close-circle',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }]
    });
    await actionSheet.present();
  }

  async tagFriendsModal(){
    const modal = await this.modalController.create({
      component: FriendsListPage,
      cssClass: '',
      componentProps: {
        page: 'tag'
      }
    });
    return await modal.present();
  }

  getPostInfo(callback?){
    // show loader
    this.loadingSpinner = true;
    // this.errorMessage = '';

    this.socialApi.getPostInfo(this.postId)
      .subscribe((value: any) => {
        if (callback) {
          callback();
        }
        // hide loader
        this.loadingSpinner = false;

        // check response
        if (value.responseState && value.data) {
          this.postInfo = value.data;
          this.postDescription = this.postInfo.content;
          this.imageUrl = this.postInfo.imageUrl;
          this.videoUrl = this.postInfo.videoUrl;

          // if(!value.data.length){
          //   this.errorMessage = 'No Feeds';
          // }
        } else {
          console.log('Failed to call API');
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

}
