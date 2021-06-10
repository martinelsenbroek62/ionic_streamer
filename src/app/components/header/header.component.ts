import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  @ViewChild('#topheader') header: ElementRef;

  constructor(private router: Router) { }

  ngOnInit() {}

  notificationsPage() {
    this.router.navigate(['/notifications']);
  }

  searchPage(){
    this.router.navigate(['/search']);
  }

}
