import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Feature1RoutingModule } from './feature1-routing.module';
import { ContainerComponent } from './container/container.component';
import { ComponentsComponent } from './components/components.component';


@NgModule({
  declarations: [
    ContainerComponent,
    ComponentsComponent,    
  ],
  imports: [
    CommonModule,
    Feature1RoutingModule
  ]
})
export class Feature1Module { }
