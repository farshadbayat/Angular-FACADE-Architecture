import { Component, OnInit } from '@angular/core';
import { ClientService } from '@core/services/client.service';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.scss'],
})
export class ContainerComponent implements OnInit {
  constructor(private clientService: ClientService) {}

  ngOnInit(): void {}

  pushNotification_onClick() {
    for (let i = 0; i < 30; i++) {
      this.clientService.toaster.open({
        text: `Hello${i + 1}`,
        type: 'info',
        maxStackLimit: 5,
      });
    }
  }
}
