import { Component, Input, OnInit } from '@angular/core';
import { MasterPageFacade } from '../../master-page.facade';
import { Bidder } from '../../models/bidder.model';

@Component({
  selector: 'app-bidder',
  templateUrl: './bidder.component.html',
  styleUrls: ['./bidder.component.scss']
})
export class BidderComponent implements OnInit {
  @Input() bidder!: Bidder;
  currentLot: any;
  randomNumber: number = 0;

  constructor(public logic: MasterPageFacade) { }

  ngOnInit(): void {
    this.logic.currentLot$.subscribe(resp =>{
      this.currentLot = resp;
      this.randomNumber = this.logic.randomIntFromInterval(2, 20) * 100;
    });
  }

  getPaddles() {
    return this.bidder.Paddles.join('-');
  }
}
