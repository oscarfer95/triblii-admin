import {ChangeDetectionStrategy, Component, HostListener, OnInit} from '@angular/core';

import Breakpoints from '../../../ss-shared/constants/breakpoints.constant';

@Component({
  selector: 'ss-admin-wrapper',
  templateUrl: './ss-wrapper.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SsWrapperComponent implements OnInit {

  public displaySidebarMenu!: boolean;
  public sidebarMenuModal!: boolean;

  @HostListener('window:resize', ['$event'])
  private _onResize(): void {
    this._updateMenuSettings();
  }

  constructor() {
  }

  ngOnInit(): void {
    this._updateMenuSettings();
  }

  public onClickMenuButton(): void {
    this.displaySidebarMenu = !this.displaySidebarMenu;
  }

  public hideMenu(): void {
    const isValidRangeToDisplayMenu: boolean = window.innerWidth >= Breakpoints.LG;

    !isValidRangeToDisplayMenu? this.displaySidebarMenu = false: this.displaySidebarMenu = true;
  }

  private _updateMenuSettings(): void {
    const isValidRangeToDisplayMenu: boolean = window.innerWidth >= Breakpoints.LG;

    if (isValidRangeToDisplayMenu) {
      this.displaySidebarMenu = true;
      this.sidebarMenuModal = false;
    } else {
      this.displaySidebarMenu = false;
      this.sidebarMenuModal = true;
    }
  }
}
