import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthguardGuard implements CanActivate {
  // canActivate(
  //   next: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
  //   return true;
  // }
    constructor(private navCtrl:NavController){ }

    canActivate(){
      let is_logged_in = localStorage.getItem('authToken');      
      if(!is_logged_in){
        this.navCtrl.navigateForward('/home');
        return false;
      }else{
        return true;
      }
  }
  
}
