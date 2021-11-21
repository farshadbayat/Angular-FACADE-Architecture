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
  public saleID: number = 646;
  public loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public clerks$: BehaviorSubject<Clerk[]> = new BehaviorSubject<Clerk[]>([]);
  public bidders$: BehaviorSubject<Bidder[]> = new BehaviorSubject<Bidder[]>([]);
  public currentLot$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public auctionLive$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private gs: GlobalService) { }

  createSocket(token: string): WebSocketSubject<any> {
    let wsSubject: WebSocketSubject<any> = new WebSocketSubject(`wss://customergateway.bidballer.com:6653/?Authorization=${token}&sale=${this.saleID}`);
    return wsSubject;
  }

  startAuction(token: string){
    const url = 'https://customergateway.bidballer.com/';
    const request = ApiRequest('POST', false).setBaseURL(url).setModuleName('')
    .setController('auctioneer').setAction('event');
    request.addParam('length', 0)
    .addBody('SaleID', this.saleID)
    .addBody('Event','START_AUCTION');
    request.addHeader('Authorization', token);
    this.gs.apiRequest<any>(request).subscribe( resp => {
      this.loading$.next(false);
      if ( resp.success === true) {
        console.log("Start Auction",resp);
        setTimeout(() =>{
          this.openLot(token, resp.data.CurrentLot);
        }, 1000);
      }
    }, err => {
      console.log(err);
      if(err.status === 900) {
        setTimeout(() => {
          this.startAuction(token);
        }, 5000);
      } else if(err.status === 902) {
      }
    });
  }

  placeBid(token: string, bidValue: number, lotID: number, lotNumber: number, paddleNumber: string){
    const url = 'https://customergateway.bidballer.com/';
    const request = ApiRequest('POST', false).setBaseURL(url).setModuleName('')
    .setController('bid').setAction('');
    request.addParam('length', 0)
    .addBody('BidValue', bidValue)
    .addBody('LotID', lotID)
    .addBody('SaleID', this.saleID)
    .addBody('LotNumber', lotNumber)
    .addBody('BidSubmitType', 'LIVE')
    .addBody('PaddleNumber', paddleNumber);
    request.addHeader('Authorization', token);
    return this.gs.apiRequest<any>(request);
  }

  openLot(token: string, currentLot: any){
    debugger
    const url = 'https://customergateway.bidballer.com/';
    const request = ApiRequest('POST', false).setBaseURL(url).setModuleName('')
    .setController('auctioneer').setAction('event');
    request.addParam('length', 0)
    .addBody('LotID', currentLot.LotID)
    .addBody('SaleID', this.saleID)
    .addBody('Event','CHANGE_LOT');
    request.addHeader('Authorization', token);
    this.gs.apiRequest<any>(request).subscribe( resp => {
      this.loading$.next(false);
      debugger
      if(resp.success === true) {
        this.currentLot$.next(currentLot);
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

  randomIntFromInterval(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }
}
