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

  clear_onClick() {
    this.facade.client.userLogout(false);
  }

  loginRequest_onClick() {
    this.facade.client.userLogout(false);
    this.facade.loginRequest().subscribe((resp) => {
      const userData: UserLogin<any> = {
        Token: resp.data.User.GUID,
        User: resp.data.User,
      };
      this.facade.client.saveUserLogin(userData);
    });
  }

  testRequest_onClick() {
    this.facade.getCityList().subscribe((resp) => {
      console.log(resp.data);
    });
  }
}
