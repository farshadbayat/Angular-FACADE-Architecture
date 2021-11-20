import { Injectable } from '@angular/core';
import { GlobalService } from '@core/services/global.service';
import { ApiRequest } from '@core/services/request.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { webSocket, WebSocketSubject } from "rxjs/webSocket";
import { Bidder } from './models/bidder.model';
import { Clerk } from './models/clerk.model';

@Injectable({
  providedIn: 'root'
})
export class MasterPageFacade {
  public totalBider: number = 2;
  public saleID: number = 7788;
  public loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public clerks$: BehaviorSubject<Clerk[]> = new BehaviorSubject<Clerk[]>([]);
  public bidders$: BehaviorSubject<Bidder[]> = new BehaviorSubject<Bidder[]>([]);


  constructor(private gs: GlobalService) { }

  createSocket(token: string): WebSocketSubject<any> {
    let wsSubject: WebSocketSubject<any> = new WebSocketSubject(`wss://customergateway.bidballer.com:6653/?Authorization=${token}&sale=${this.saleID}`);
    return wsSubject;
  }

  openSale(token: string){
    // https://customergateway.bidballer.com/auctioneer/event?length=0
    // Event: "START_AUCTION"
    // SaleID: 635
    const url = 'https://customergateway.bidballer.com/test/';
    const request = ApiRequest('POST', false).setBaseURL(url).setModuleName('')
    .setController('auctioneer').setAction('event');
    request.addParam('length', 0)
    .addBody('SaleID', this.saleID)
    .addBody('Event','START_AUCTION');
    request.addHeader('Authorization', token);
    this.gs.apiRequest<any>(request).subscribe( resp => {
      this.loading$.next(false);
      if ( resp.success === true) {
        debugger
      }
    });
  }

  ClearPrepare(){
    // https://customergateway.bidballer.com/test/clear?length=0
    const url = 'https://customergateway.bidballer.com/test/';
    const request = ApiRequest('POST', false).setBaseURL(url).setModuleName('performance')
    .setController('').setAction('clear');
    request.addParam('Count', 0)
    .addBody('SaleID', this.saleID);
    this.gs.apiRequest<any>(request).subscribe( resp => {
      this.loading$.next(false);
      if ( resp.success === true) {
        debugger
      }
    });
  }

  fetchUserList() {
    this.loading$.next(true);
    const url = 'https://customergateway.bidballer.com/test/';
    const request = ApiRequest('GET', false).setBaseURL(url).setModuleName('performance')
    .setController('bot').setAction('userlist');
    request.addParam('Count', this.totalBider)
    .addParam('SaleID', this.saleID);
    this.gs.apiRequest<any>(request).subscribe( resp => {
      this.loading$.next(false);
      if ( resp.success === true) {
        this.bidders$.next(resp.data.Bidders);
        this.clerks$.next(resp.data.Clerks);
      }
    });
  }
}
