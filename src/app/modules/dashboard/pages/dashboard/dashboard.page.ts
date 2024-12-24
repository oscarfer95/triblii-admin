import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardPage {

  constructor() { }

}
