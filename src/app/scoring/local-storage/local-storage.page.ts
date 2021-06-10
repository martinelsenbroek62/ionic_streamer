import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import{ Storage }from '@ionic/storage';

@Component({
  selector: 'app-local-storage',
  templateUrl: './local-storage.page.html',
  styleUrls: ['./local-storage.page.scss'],
})
export class LocalStoragePage implements OnInit {
  public match: any;
  public localMatches: any = [];

  constructor(private storage: Storage, private router: Router, private alertCtrl: AlertController) { }

  ngOnInit() {
    this.getLocalStorage();
  }

  getLocalStorage() {
    this.storage.keys().then(keys=>{    
      keys.forEach(key => {
        if(key.indexOf('match') !== -1 && key.indexOf('delete-balls') === -1) {
          this.storage.get(key).then(matchData=>{
            this.localMatches.push(matchData);
            console.log(this.localMatches);
          });
        }
      });
    });        
  }

  matchDetails(match) {
    this.router.navigate(['/local-storage-details'], { state: {match: match}});
  }

  async deleteLocalMatch(match) {
    const deleteAlert = await this.alertCtrl.create({
      header: 'Delete Local Data',
      subHeader: 'Are you sure you want to delete the balls?',
      backdropDismiss: false,     
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            //console.log('Cancel clicked');
          }
        },
        {
          text: 'Ok',
          handler: () => {
            this.storage.remove('match-'+match.clubId+'-'+match.matchId+'save-balls').then(()=>{
              //Toast or something
            });
            //this.storage.remove('match-'+match.clubId+'-'+match.matchId);
            this.localMatches = [];
            this.getLocalStorage();
          }
        }
      ]
    });
    await deleteAlert.present();       
  }

}
