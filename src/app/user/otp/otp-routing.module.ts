import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OTPPage } from './otp.page';

const routes: Routes = [
  {
    path: '',
    component: OTPPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OTPPageRoutingModule {}
