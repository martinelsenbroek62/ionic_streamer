import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { CcutilService } from 'src/app/services/ccutil.service';
import { TeamAvailabilityComponent } from '../../modals/team-availability/team-availability.component';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
})
export class ScheduleComponent implements OnInit {
  @Input() scheduleList:any;
  @Input() sourcePage:any;
  @Output() availabilityClick: EventEmitter<any> = new EventEmitter();

  loadingSpinner: any;

  constructor(public ccUtil: CcutilService, private modalController: ModalController) { }

  ngOnInit() {
    console.log(this.sourcePage);
  }

  async openTeamAvailabilityModal(schedule) {
    /* open extras - NoBalls in modal to get data back to this page when modal closed */
    const modal = await this.modalController.create({
      component: TeamAvailabilityComponent,
      cssClass: '',
      componentProps: {
        schedule: schedule
      }
    });
    await modal.present();

    const resp: any = await modal.onDidDismiss();
    if (resp && resp.data) {
      
    }
  }

  async onAvailabilityClick(event, schedule, status) {
    this.availabilityClick.emit({ event, schedule, status }); // emit event here
  }

}
