import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContainerComponent } from './container/container.component';
import { ComponentsComponent } from './components/components.component';
import { Challenge03RoutingModule } from './challenge03-routing.module';

@NgModule({
  declarations: [ContainerComponent, ComponentsComponent],
  imports: [CommonModule, Challenge03RoutingModule],
})
export class Challenge03Module {}
