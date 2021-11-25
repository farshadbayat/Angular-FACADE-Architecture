import { Component, OnInit } from '@angular/core';
import { GlobalService } from '@core/services/global.service';
import { ApiRequest } from '@core/services/request.service';
import { MasterPageFacade } from '../master-page.facade';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.scss']
})
export class ContainerComponent implements OnInit {
  constructor(public logic: MasterPageFacade) { }

  ngOnInit(): void {
  }

  testToast() {
    this.logic.gs.toaster.open({ text: 'Hi', type: 'dark' , maxStackLimit: 3 });
  }
}
