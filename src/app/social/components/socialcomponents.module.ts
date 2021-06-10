import { NgModule } from "@angular/core";
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SocialFeedComponent } from '../components/social-feed/social-feed.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

@NgModule({
  declarations: [
    SocialFeedComponent
  ],
  imports: [
    IonicModule,
    FormsModule,
    CommonModule,
    Ng2SearchPipeModule],
  exports: [
    SocialFeedComponent
  ]
})
export class SocialComponentsModule {}
