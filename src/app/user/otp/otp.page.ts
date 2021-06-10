import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { NavController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { CcutilService } from 'src/app/services/ccutil.service';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.page.html',
  styleUrls: ['./otp.page.scss'],
})
export class OTPPage implements OnInit {
  public otp_form: FormGroup;
  phone: any;
  mobileCode: any;
  userId: any;
  otp: any;

  constructor(private formBuilder: FormBuilder, private navCtrl:NavController, private ccUtil: CcutilService, private router: Router,
    private modalctrl:ModalController, private userService: UserService) {
    this.otp_form = formBuilder.group({
      otp1: ['',  [Validators.required, Validators.min(1)]],
      otp2: ['',  [Validators.required, Validators.min(1)]],
      otp3: ['',  [Validators.required, Validators.min(1)]],
      otp4: ['',  [Validators.required, Validators.min(1)]], 
      otp5: ['',  [Validators.required, Validators.min(1)]],
      otp6: ['',  [Validators.required, Validators.min(1)]]
    });

    if (history.state && history.state.userId) {
      // console.log('history.state.data', history.state.data);
      this.phone = history.state.phone;
      this.mobileCode = history.state.mobileCode;
      this.userId = history.state.userId;
    }
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.ccUtil.setAnalyticsEvents('OTP Page');
  }

  checkBackButton(prevElement, val){
    if(val === ""){
      prevElement.setFocus();
    }
  }
 
  validateInput(nextElement, val, type, end=null){
    if(val){
      var last_digit = val.toString().slice(0, 1);           
      if(type==1){
        this.otp_form.controls.otp1.setValue(parseInt(last_digit));        
        nextElement.setFocus(); 
      } else if(type==2){
        this.otp_form.controls.otp2.setValue(parseInt(last_digit));        
        nextElement.setFocus(); 
      } else if(type == 3){
        this.otp_form.controls.otp3.setValue(parseInt(last_digit));        
        nextElement.setFocus(); 
      }else if(type==4){
        this.otp_form.controls.otp4.setValue(parseInt(last_digit));        
        nextElement.setFocus(); 
      }else if(type==5){
        this.otp_form.controls.otp5.setValue(parseInt(last_digit));        
        nextElement.setFocus(); 
      }else if(type==6){
        this.otp_form.controls.otp6.setValue(parseInt(last_digit));        
        nextElement.setFocus(); 
      }            
    }       
  }

  onOtpChange(value) {
    this.otp = value;
  }

  verify_now() {
    if(this.otp.length != 6){
        // this.ccUtil.presentToast('6 digit OTP is required.', 'danger');
        // this.commonFailModal('6 digit OTP is required');
        return;
    }
    // call API to register user
    this.userService.sendOTP(this.userId, this.otp)
      .subscribe((response: any) => {
        if (response.data) {
          // redirect to corresponding page
          localStorage.setItem('authToken', response.data);
          this.router.navigate(['/maintabs'], { state: { data: 'homefeed'} });

        } else if(!response.responseState){
          this.ccUtil.messageAlert('Registration Failed', response.errorMessage);
        }
      },(error) => {
        console.log('Api error : ' + error);
        if(error.name == 'HttpErrorResponse')
          this.ccUtil.messageAlert('Registration Failed', 'Please check your Network Connection');
        else
          this.ccUtil.messageAlert('Registration Failed', error.message);
      });
  }



  resend_otp(){
    this.ccUtil.showLoader();
    // call API to resend otp for registration
    // this.userService.resendOtp_register((value: any) => {
    //         this.ccUtil.hideLoader();
    //           console.log('value', value);
    //           if(value.responseState){
    //             // this.success_modal('OTP Resent successfully');
    //             // this.ccUtil.presentToast('OTP Resent successfully','success','middle',1500);             
    //           }else{
    //             // this.commonFailModal(value.errorMessage);
    //             // this.ccUtil.presentToast(value.errorMessage,'danger','middle',1500);
    //           }
          
    //     }, this.phone);
  }

  // async commonFailModal(msg) {
  //     const modal = await this.modalctrl.create({
  //         component: CommonfailComponent,
  //         cssClass: 'modal-transparency',
  //         componentProps: { 'message': msg }
  //     });
  //     modal.onDidDismiss().then((res) => {
  //         if (res.data['action'] == 'ok') {
  //             // alert('OTP SUCCESS');
  //             // this.navCtrl.back();
  //         }
  //     });
  //     return await modal.present();
  // }

  //   async success_modal(msg) {
  //     const modal = await this.modalctrl.create({
  //         component: CommonupdateComponent,
  //         cssClass: 'modal-transparency',
  //         componentProps: { 'message': msg }
  //     });
  //     modal.onDidDismiss().then((res) => {
  //         if (res.data['action'] == 'ok') {
  //             // alert('OTP SUCCESS');
  //             // this.navCtrl.back();
  //         }
  //     });
  //     return await modal.present();
  // }

}