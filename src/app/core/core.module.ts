import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AuthGuard } from '@core/services/auth.guard';
import { Environment, IEnvironment } from './models/enviroment.model';
import { ToastNotificationsModule } from './modules/toast-notification';
import { ResponseErrorHandelingService } from './services/response-error-handeling.service';

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
    FormsModule,
  ],
  providers: [AuthGuard],
})
export class CoreModule {
  static forRoot(config: IEnvironment): ModuleWithProviders<CoreModule> {
    return {
      ngModule: CoreModule,
      providers: [
        {
          provide: Environment,
          useValue: config,
        },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: ResponseErrorHandelingService,
          multi: true,
        },
      ],
    };
  }
}
