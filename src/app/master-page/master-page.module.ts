import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MasterPageRoutingModule } from './master-page-routing.module';
import { ContainerComponent } from './container/container.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { BidderComponent } from './components/bidder/bidder.component';
import { ClerkComponent } from './components/clerk/clerk.component';

const CommonMaterialModule = [ MatButtonModule, MatCardModule, MatInputModule, MatProgressBarModule ];

@NgModule({
  declarations: [
    ContainerComponent,
    BidderComponent,
    ClerkComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MasterPageRoutingModule,
    CommonMaterialModule
  ]
})
export class MasterPageModule { }
