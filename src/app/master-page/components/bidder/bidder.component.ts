import { Component, Input, OnInit } from '@angular/core';
import { WebSocketSubject } from 'rxjs/webSocket';
import { MasterPageFacade } from '../../master-page.facade';
import { Bidder } from '../../models/bidder.model';

@Component({
  selector: 'app-bidder',
  templateUrl: './bidder.component.html',
  styleUrls: ['./bidder.component.scss']
})
export class BidderComponent implements OnInit {
  @Input() bidder!: Bidder;
  wsSubject!: WebSocketSubject<any>;
  currentLot: any;
  randomNumber: number = 0;
  bidValue = 0;
  status = '';

  constructor(public logic: MasterPageFacade) { }

  ngOnInit(): void {
    this.logic.currentLot$.subscribe(resp => {
      this.currentLot = resp;
      if(this.currentLot !== null && this.currentLot !== undefined) {
        this.randomNumber = this.logic.randomIntFromInterval(2, 20) * 100;
        this.initSocket();
      }
    });

    this.logic.auctionLive$.subscribe( resp => {
      if(resp === true && this.wsSubject === undefined) {
        debugger
        this.initSocket();
      }
    });
  }

  getPaddles() {
    return this.bidder.Paddles.join('-');
  }

  pingSW() {
    const pingData = {code: 7000};
    this.wsSubject.next(pingData);
  }

  initSocket() {
    this.wsSubject = this.logic.createSocket( this.bidder.Token );
    console.log('Init Socket');
    setTimeout(() =>{this.pingSW();}, 5000);
    this.wsSubject.subscribe( resp => {
      console.log(resp);
      if(resp.code === 7001) {
        setTimeout(() =>{ this.pingSW(); }, 5000);
        return;
      }
      if(resp.success === undefined && resp.success !== false) {
        console.log(resp);
        // this.bidValue = (this.currentLot.MinBid || 0) + this.currentLot.Increment + this.logic.randomIntFromInterval(0, 30);
        // setInterval(() => {
        //   const paddleIndex = this.logic.randomIntFromInterval(0, this.bidder.Paddles.length - 1);
        //   this.logic.placeBid(
        //     this.bidder.Token,
        //     this.bidValue,
        //     this.currentLot.LotID,
        //     this.currentLot.LotNumber,
        //     this.bidder.Paddles[paddleIndex]).subscribe( resp => {
        //     if ( resp.success === true) {
        //       this.status = resp.data;
        //     }
        //   });
        // }, this.randomNumber + 5000);
      }
    });
  }

}
