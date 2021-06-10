import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ScoringService } from '../../services/scoring.service';

@Component({
  selector: 'app-man-of-the-match',
  templateUrl: './man-of-the-match.component.html',
  styleUrls: ['./man-of-the-match.component.scss'],
})
export class ManOfTheMatchComponent implements OnInit {
  @Input() matchId: any;
  @Input() clubId: any;

  public players: any;
  public limit: boolean = false;
  public selectedPlayer: any;

  constructor(private scoringService: ScoringService, private modalController: ModalController) { }

  ngOnInit() {
    this.getManOfTheMatchInfo();
    this.players = [{"playerId":42045,"fName":"James","lName":"Faulkner","ballsFaced":22,"runsScored":105,"ballsBowled":13,"runsGiven":18,"totalPoints":386,"wickets":0},{"playerId":42099,"fName":"Kyle","lName":"Mills","ballsFaced":17,"runsScored":49,"ballsBowled":9,"runsGiven":34,"totalPoints":139,"wickets":0},{"playerId":42092,"fName":"Martin","lName":"Guptill","ballsFaced":15,"runsScored":45,"ballsBowled":0,"runsGiven":0,"totalPoints":135,"wickets":0},{"playerId":42038,"fName":"Shane","lName":"Watson","ballsFaced":0,"runsScored":0,"ballsBowled":12,"runsGiven":31,"totalPoints":100,"wickets":4},{"playerId":42101,"fName":"Trent","lName":"Boult","ballsFaced":16,"runsScored":30,"ballsBowled":0,"runsGiven":0,"totalPoints":100,"wickets":0},{"playerId":1703469,"fName":"Ashok","lName":"Bauba","ballsFaced":5,"runsScored":10,"ballsBowled":0,"runsGiven":0,"totalPoints":70,"wickets":0},{"playerId":42041,"fName":"Glenn","lName":"Maxwell","ballsFaced":5,"runsScored":10,"ballsBowled":22,"runsGiven":67,"totalPoints":60,"wickets":1},{"playerId":42040,"fName":"Steve","lName":"Smith","ballsFaced":0,"runsScored":0,"ballsBowled":7,"runsGiven":16,"totalPoints":20,"wickets":1},{"playerId":42091,"fName":"Brendon","lName":"Mccullum","ballsFaced":2,"runsScored":6,"ballsBowled":0,"runsGiven":0,"totalPoints":6,"wickets":0},{"playerId":42096,"fName":"Luke","lName":"Ronchi","ballsFaced":0,"runsScored":0,"ballsBowled":0,"runsGiven":0,"totalPoints":0,"wickets":0},{"playerId":42047,"fName":"Patt","lName":"Cummins","ballsFaced":0,"runsScored":0,"ballsBowled":0,"runsGiven":0,"totalPoints":0,"wickets":0},{"playerId":1726409,"fName":"Reere","lName":"Mmmm","ballsFaced":0,"runsScored":0,"ballsBowled":6,"runsGiven":15,"totalPoints":0,"wickets":0},{"playerId":42048,"fName":"Josh","lName":"Hazlewood","ballsFaced":0,"runsScored":0,"ballsBowled":0,"runsGiven":0,"totalPoints":0,"wickets":0},{"playerId":42098,"fName":"Daniel","lName":"Vettori","ballsFaced":0,"runsScored":0,"ballsBowled":6,"runsGiven":36,"totalPoints":0,"wickets":0},{"playerId":42094,"fName":"Ross","lName":"Taylor","ballsFaced":1,"runsScored":0,"ballsBowled":0,"runsGiven":0,"totalPoints":-10,"wickets":0},{"playerId":42095,"fName":"Corey","lName":"Anderson","ballsFaced":1,"runsScored":0,"ballsBowled":0,"runsGiven":0,"totalPoints":-10,"wickets":0},{"playerId":42093,"fName":"Kane","lName":"Williamson","ballsFaced":0,"runsScored":0,"ballsBowled":12,"runsGiven":51,"totalPoints":-30,"wickets":0}];
  }

  getManOfTheMatchInfo(){
    this.scoringService.getManOfTheMatchInfo(this.clubId, this.matchId).subscribe((value: any) => {
      this.players = value.data;
      this.selectedPlayer = this.players[0].playerId;
      console.log(this.players);
    });
  }

  setManOfTheMatchInfo(){
    this.scoringService.setManOfTheMatchInfo(this.clubId, this.matchId, this.selectedPlayer).subscribe(()=>{
      this.modalController.dismiss();
    });
  }

  dismissModal() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss();
  }
}
