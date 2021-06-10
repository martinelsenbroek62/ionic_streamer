import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AnonymousGuardService implements CanActivate {

  constructor(private navCtrl:NavController) { }
  canActivate(){  
        let is_logged_in = localStorage.getItem('authToken');      
        if(is_logged_in){
            this.navCtrl.navigateForward('/maintabs/myhome');
            return false;
        }else{
            return true;
        }
  }

}
