import { Component, HostBinding, Input, OnInit } from '@angular/core';
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
  @HostBinding("class.normal") @Input() normal: boolean = false;
  @HostBinding("class.error") @Input() error: boolean = false;
  wsSubject!: WebSocketSubject<any>;
  currentLot: any;
  randomNumber: number = 0;
  bidValue = 0;
  status = '';
  bidEnable = false;
  currentPaddle = '';
  intervalID?: any = undefined;

  constructor(public logic: MasterPageFacade) { }

  ngOnInit(): void {
    this.logic.currentLot$.subscribe(resp => {
      console.log(resp);
      this.currentLot = resp;
      if(this.currentLot !== null && this.currentLot !== undefined) {
        this.randomNumber = this.logic.randomIntFromInterval(2, 10) * 100;
        this.initSocket();
      }
    });

    this.logic.auctionLive$.subscribe( resp => {
      if(resp === true && this.wsSubject === undefined) {
        debugger
        this.initSocket();
      }
    });

    this.logic.stopSignal$.subscribe( id => {
      if(this.intervalID && id > 0) {
        clearInterval(this.intervalID);
        debugger
        if(this.bidValue === this.logic.maxBidSignal$.value) {
          this.logic.openNextLot(this.bidder.Token);
        }
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
      if(resp?.data?.RealPrice) {
        console.log(resp.data.CurrentLot.RealPrice);

        this.currentLot.RealPrice = resp.data.CurrentLot.RealPrice;
        this.currentLot.MinBid = resp.data.CurrentLot.MinBid;
        this.currentLot.Increment = resp.data.CurrentLot.Increment;
        this.currentLot.Status = resp.data.CurrentLot.Status;
      }
      if(resp?.data?.CurrentLot !== undefined) {
        this.currentLot.RealPrice = resp.data.CurrentLot.RealPrice;
        this.currentLot.MinBid = resp.data.CurrentLot.MinBid;
        this.currentLot.Increment = resp.data.CurrentLot.Increment;
        this.currentLot.Status = resp.data.CurrentLot.Status;
        if(this.bidEnable === false) {
          this.intervalID = setInterval(() => {
            const paddleIndex = this.logic.randomIntFromInterval(0, this.bidder.Paddles.length - 1);
            this.currentPaddle = this.bidder.Paddles[paddleIndex];
            this.bidValue = (this.currentLot?.RealPrice || this.currentLot?.MinBid || 0) + this.currentLot.Increment + this.logic.randomIntFromInterval(0, 9)*this.currentLot.Increment ;
            console.log(this.bidValue);
            this.logic.placeBid(
              this.bidder.Token,
              this.bidValue,
              this.currentLot.LotID,
              this.currentLot.LotNumber,
              this.currentPaddle).subscribe( resp => {
                this.currentLot.RealPrice = this.bidValue;
                this.logic.setChangeBid(this.bidValue);
                this.error = false;
                this.normal = true;
                this.status = resp.data;
            }, err =>{
              this.currentLot.RealPrice = err.error.data.RealPrice;
              this.normal = false;
              this.error = true;
            });
          }, this.randomNumber+1000);
        }
      }
    });
  }

}
