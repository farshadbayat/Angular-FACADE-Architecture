import { Component, OnInit } from '@angular/core';
import { GlobalService } from '@core/services/global.service';
import { ApiRequest } from '@core/services/request.service';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.scss']
})
export class ContainerComponent implements OnInit {

  constructor(private gs: GlobalService) { }

  ngOnInit(): void {
    this.fetchUser();
  }

  fetchUser() {
    const url = 'https://customergateway.bidballer.com/test/';
    const request = ApiRequest('GET', false).setBaseURL(url).setModuleName('performance')
    .setController('bot').setAction('userlist');
    request.addParam('Count', 4)
    .addParam('SaleID', 7788);
    this.gs.apiRequest<any>(request).subscribe( resp => {
      debugger
      if ( resp.Success === true) {
      }
    });
  }

}
