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

  constructor(public logic: MasterPageFacade) { }

  ngOnInit(): void {
  }

  getPaddles() {
    return this.bidder.Paddles.join('-');
  }
}
