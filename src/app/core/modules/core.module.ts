import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AuthGuard } from '@core/services/auth.guard';
import { ToastNotificationsModule } from './toast-notification';

@NgModule({
    imports: [
      BrowserModule,
      CommonModule,
      FormsModule,
      HttpClientModule,
      ToastNotificationsModule,
    ],
    exports: [
      CommonModule,
      ToastNotificationsModule,
      HttpClientModule,
      FormsModule
    ],
    providers:[AuthGuard]
})

export class CoreModule {
}
