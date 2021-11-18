import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MasterPageRoutingModule } from './master-page-routing.module';
import { ContainerComponent } from './container/container.component';


@NgModule({
  declarations: [
    ContainerComponent
  ],
  imports: [
    CommonModule,
    MasterPageRoutingModule
  ]
})
export class MasterPageModule { }
