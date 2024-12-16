import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'ss-home-page',
  templateUrl: './ss-home.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SsHomePage {

  constructor() { }
}
