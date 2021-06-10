import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PostDetailsPageRoutingModule } from './post-details-routing.module';

import { PostDetailsPage } from './post-details.page';
import { SocialComponentsModule } from '../components/socialcomponents.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PostDetailsPageRoutingModule,
    SocialComponentsModule
  ],
  declarations: [PostDetailsPage]
})
export class PostDetailsPageModule {}
