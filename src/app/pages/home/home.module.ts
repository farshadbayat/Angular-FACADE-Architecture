import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContainerComponent } from './container/container.component';
import { ComponentsComponent } from './components/components.component';
import { HomeRoutingModule } from './home-routing.module';

@NgModule({
  declarations: [ContainerComponent, ComponentsComponent],
  imports: [CommonModule, HomeRoutingModule],
})
export class HomeModule {}
