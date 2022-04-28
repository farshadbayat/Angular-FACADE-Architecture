import { Injector, NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceLocator } from '@core/services/locator.service';
import { CoreModule } from '@core/core.module';
import { environment } from 'src/environments/environment';

@NgModule({
  declarations: [AppComponent],
  imports: [
    CoreModule.forRoot({
      apiVersion: environment.API_VERSION,
      baseEndpoint: environment.BASE_ENDPOINT,
      apiSignatureName: '',
      debug: environment.production,
      loginRoute: environment.LOGIN_ROUTE,
      urlPathSchema: environment.URL_PATH_SCHEMA,
    }),
    AppRoutingModule,
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(injector: Injector) {
    ServiceLocator.injector = injector;
  }
}
