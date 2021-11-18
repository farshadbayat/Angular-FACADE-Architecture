import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MasterPageRoutingModule } from './master-page-routing.module';
import { ContainerComponent } from './container/container.component';
import { ComponentsComponent } from './components/components.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
const CommonMaterialModule = [ MatButtonModule, MatCardModule ];

@NgModule({
  declarations: [
    ContainerComponent,
    ComponentsComponent
  ],
  imports: [
    CommonModule,
    MasterPageRoutingModule,
    CommonMaterialModule
  ]
})
export class MasterPageModule { }
