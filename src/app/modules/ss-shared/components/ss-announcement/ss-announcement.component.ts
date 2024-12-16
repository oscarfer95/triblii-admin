import {Component, Input} from '@angular/core';

@Component({
  selector: 'ss-announcement',
  templateUrl: './ss-announcement.component.html'
})
export class SsAnnouncementComponent {

  @Input()
  public iconName: string;

  @Input()
  public text: string;

  @Input()
  public spin: boolean;

  constructor() {
    this.iconName = 'pi-cog';
    this.text = 'Próximamente';
    this.spin = true;
  }
}
