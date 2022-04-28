import { Injectable } from '@angular/core';
import { ClientService } from '@core/services/client.service';
import { Api } from '@core/classes/request-builder';
import { IResponse } from '@core/models/response.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Feature1Facade {
  constructor(public gs: ClientService) {}

  loginRequest(): Observable<IResponse<any>> {
    return Api()
      .post()
      .module('AlphaCore')
      .controller('user')
      .action('login')
      .addBody('username', 'admin')
      .addBody('password', 'asb85510.+')
      .call();
  }

  cityRequest(): Observable<IResponse<any>> {
    return this.gs.api().post().controller('address').action('citylist').call();
  }
}
