import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { AuthGuard } from '@core/services/auth.guard';
import { ToastNotificationsModule } from './toast-notification';

@NgModule({
    imports: [
      BrowserModule,
      CommonModule,
      HttpClientModule,
      ToastNotificationsModule,
    ],
    exports: [
      CommonModule,
      ToastNotificationsModule,
      HttpClientModule
    ],
    providers:[AuthGuard]
})

export class CoreModule {
}
