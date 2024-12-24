import {Component, Input} from '@angular/core';

@Component({
  selector: 'announcement',
  templateUrl: './announcement.component.html'
})
export class AnnouncementComponent {

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
