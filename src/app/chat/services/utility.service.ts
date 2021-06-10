import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  constructor(private toastctrl:ToastController) { }

  getDateString(timestamp) {
    if (timestamp) {
      const ts = new Date(timestamp);
      const dObj = {
        time: ts.toLocaleTimeString(),
        date: ts.toDateString()
      };
      // console.log('dObj', dObj);
      return dObj; // Fri Apr 19 2019
    }
  }

  async presentToast(message: any, color: any = 'dark', position: any = 'bottom', duration=2000, cssClass: any = '') {
    const toast = await this.toastctrl.create({
      message,
      duration,
      position,
      color,
      cssClass,
    });
    toast.present();
  }
}
