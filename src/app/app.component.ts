import { Component } from '@angular/core';
import { Theme } from 'src/themes/theme.type';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  theme: Theme = "light-theme";
}
