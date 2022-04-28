import { Component, OnInit } from '@angular/core';
import { Feature1Facade } from '../feature1.facade';
import { UserLogin } from '@core/models/user-login.model';
@Component({
  selector: 'app-components',
  templateUrl: './components.component.html',
  styleUrls: ['./components.component.scss'],
})
export class ComponentsComponent implements OnInit {
  constructor(private facade: Feature1Facade) {}

  ngOnInit(): void {}

  loginRequest_onClick() {
    this.facade.gs.userLogout(false);
    this.facade.loginRequest().subscribe((resp) => {
      const userData: UserLogin<any> = {
        Token: resp.data.User.GUID,
        User: resp.data.User,
      };
      this.facade.gs.saveUserLogin(userData);
    });
  }

  testRequest_onClick() {
    this.facade.cityRequest().subscribe((resp) => {
      console.log(resp.data);
    });
  }
}
