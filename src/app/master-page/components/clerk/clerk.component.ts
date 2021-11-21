import { Component, Input, OnInit } from '@angular/core';
import { WebSocketSubject } from 'rxjs/webSocket';
import { MasterPageFacade } from '../../master-page.facade';
import { Clerk } from '../../models/clerk.model';

@Component({
  selector: 'app-clerk',
  templateUrl: './clerk.component.html',
  styleUrls: ['./clerk.component.scss']
})
export class ClerkComponent implements OnInit {
  @Input() clerk!: Clerk;
  wsSubject!: WebSocketSubject<any>;
  currentLot: any;
  // wss://customergateway.bidballer.com:6653/?Authorization=eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJDbGVyazEiLCJzYWx0IjoiNjJjYTYwNmMtYjk0Ny00MmJhLTg4MDQtODA5YzIzMDBiZmM0IiwidXNlcm5hbWUiOiJDbGVyazEiLCJ1c2VySWQiOjYsInJvbGUiOjIsInVzZXJLaW5kSWQiOjIsImZ1bGxOYW1lIjoiRGF2aWQgRHVlY2siLCJpYXQiOjE2MzczOTQ2NTAsImV4cCI6MTc2MjU1ODE3MH0.SEKfGXVMZ7ZxTZj4PEJke3HTQ-K7TI29lhIxdRxMIJ_y17Jzv-tatVOD22zYU5VJ6TZwncAA-bvJ5nOJE-sKcA&sale=635
  status: string = 'Prepareing';

  constructor(public logic: MasterPageFacade) { }

  ngOnInit(): void {

    this.logic.currentLot$.subscribe(resp =>{
      this.currentLot = resp;
      if( this.currentLot !== null) {
        this.initSocket();
      }
    });

    setTimeout(() =>{
      this.status = 'Auction going to start';
      this.logic.startAuction(this.clerk.Token);
    }, 5 * 1000);
  }

  acked = false;
  pingSW() {
    const pingData = {code: 7000};
    this.wsSubject.next(pingData);
  }

  initSocket() {
    this.wsSubject = this.logic.createSocket( this.clerk.Token);
    console.log('Init Socket');
    setTimeout(() =>{this.pingSW();}, 5000);
    this.wsSubject.subscribe( resp => {
      console.log(resp);
      if(resp.code === 7001) {
        setTimeout(() =>{this.pingSW();}, 5000);
        return;
      }
      if(resp.success === undefined && resp.success !== false) {
        this.status = resp.data.SaleStatus;
        if(resp.data.SaleStatus === 'LIVE') {
          this.logic.auctionLive$.next(true);
          this.status = 'Open Lot ' + this.currentLot.LotID;
          this.logic.openLot(this.clerk.Token, this.currentLot.LotID);
        }
      }
    });
  }
}
