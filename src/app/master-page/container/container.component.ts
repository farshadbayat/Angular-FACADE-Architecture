import { Component, OnInit } from '@angular/core';
import { GlobalService } from '@core/services/global.service';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.scss']
})
export class ContainerComponent implements OnInit {

  constructor(private gs: GlobalService) { }

  ngOnInit(): void {
  }

  pushNotification_onClick() {
    for (let i = 0; i < 30; i++) {
      this.gs.toaster.open({ text: `Hello${i+1}` , type: 'info'});
    }
  }

}
