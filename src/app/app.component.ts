import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {OverviewComponent} from "./overview/overview.component";
import {MatToolbar} from "@angular/material/toolbar";
import {MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatTab, MatTabGroup} from "@angular/material/tabs";

// import {HttpClientModule} from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, OverviewComponent, MatToolbar, MatIconButton, MatIcon, MatTabGroup, MatTab],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'OpenRoboticsTeam';

  constructor() {
  }
}
