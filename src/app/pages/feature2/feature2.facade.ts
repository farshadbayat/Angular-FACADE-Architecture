import { Injectable } from '@angular/core';
import { ClientService } from '@core/services/client.service';
import { Api } from '@core/classes/request-builder';

@Injectable({
  providedIn: 'root',
})
export class Feature2Facade {
  constructor(private client: ClientService) {}

  startAuction() {
    this.client.api();
    const request = Api('POST', false).module('').controller('').action('');
    request.addParam('param1', null).addBody('param2', null);
  }
}
