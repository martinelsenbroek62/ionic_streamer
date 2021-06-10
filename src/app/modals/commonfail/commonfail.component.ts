import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-commonfail',
  templateUrl: './commonfail.component.html',
  styleUrls: ['./commonfail.component.scss'],
})
export class CommonfailComponent implements OnInit {

  public message:string;
  constructor(private modalctrl: ModalController,private navparams: NavParams) { 
    this.message = this.navparams.get('message');
   }

    ngOnInit() {}

    modalClose(){
      this.modalctrl.dismiss({'action':'close'});
    }

    ok(){
      this.modalctrl.dismiss({'action':'ok'});
    }

}
