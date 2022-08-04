import { Injectable } from '@angular/core';
import { GlobalService } from '@core/services/global.service';
import { ApiRequest } from '@core/services/request.service';

@Injectable({
  providedIn: 'root'
})
export class Feature2Facade {

  constructor(private gs: GlobalService) { }

  startAuction(){
    const request = ApiRequest('POST', false).setModuleName('')
    .setController('').setAction('');
    request.addParam('param1', null)
    .addBody('param2', null);
    this.gs.apiRequest<any>(request).subscribe( resp => {
    });
  }
}
