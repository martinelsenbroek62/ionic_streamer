import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ScoringService } from '../../services/scoring.service';

@Component({
  selector: 'app-dls-chart-page',
  templateUrl: './dls-chart-page.component.html',
  styleUrls: ['./dls-chart-page.component.scss'],
})
export class DlsChartPageComponent implements OnInit {
  @Input() matchId: any;
  @Input() clubId: any;

  public chartData: any;

  constructor(public modalController: ModalController, private scoringService: ScoringService) { }

  ngOnInit() {
    this.getDLSChartData();
  }

  dismissModal() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss();
  }

  getDLSChartData(){
    this.scoringService.getParScoreData(this.clubId, this.matchId).subscribe((value: any) => {
      this.chartData = value.data;
    });
  }

}
