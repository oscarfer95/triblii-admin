import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'ss-dashboard',
  templateUrl: './ss-dashboard.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SsDashboardPage {

  constructor() { }

}
