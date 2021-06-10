import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OTPPageRoutingModule } from './otp-routing.module';

import { OTPPage } from './otp.page';

import { NgOtpInputModule } from 'ng-otp-input';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OTPPageRoutingModule,
    NgOtpInputModule
  ],
  declarations: [OTPPage]
})
export class OTPPageModule {}
