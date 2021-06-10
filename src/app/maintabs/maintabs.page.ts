import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CcutilService } from '../services/ccutil.service';

@Component({
  selector: 'app-maintabs',
  templateUrl: './maintabs.page.html',
  styleUrls: ['./maintabs.page.scss'],
})
export class MaintabsPage implements OnInit {

  userObject: any;
  showBackdrop = false;
  selectedTab: string = "mygames";
  sourcePage: string;

  constructor(private ccUtil: CcutilService, private router: Router) { 
    if(this.router.getCurrentNavigation().extras.state)
      this.selectedTab = this.router.getCurrentNavigation().extras.state.data;
    else if(this.router && this.router.url){
      let tempArray = this.router.url.split('/');
      this.selectedTab = tempArray[tempArray.length-1];
    }
  }

  ngOnInit() {
    
  }

  ionViewWillEnter() {
    this.ccUtil.setAnalyticsEvents('Main Tabs Page');
  }

}
