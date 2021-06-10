import { Component, OnInit } from '@angular/core';
import { CONSTANTS } from '../constants/constants';
import { CcutilService } from '../services/ccutil.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {
  public isMenuOpen = false;
  APP_VERSION: any;
  userObject: any;

  constructor(private ccUtil: CcutilService) {
    
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.ccUtil.setAnalyticsEvents('Menu Page');
  }

  public toggleAccordion(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

}
