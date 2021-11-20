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
  status: string = '';

  constructor(public logic: MasterPageFacade) { }

  ngOnInit(): void {
    debugger
    this.wsSubject = this.logic.createSocket( this.clerk.Token);
    this.wsSubject.subscribe( resp => {
      if(resp.success === undefined && resp.success !== false) {
        this.status = resp.data.SaleStatus;
        if(resp.messages && resp.messages.length === 1 && resp.messages[0] === 'START_AUCTION') {

        }
      }
    });

    this.logic.openSale(this.clerk.Token);
  }

}
